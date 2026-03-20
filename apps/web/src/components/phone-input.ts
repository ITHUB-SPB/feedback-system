interface MaskOptions {
  mask: string;
  tokens: Record<
    string,
    {
      pattern: RegExp;
    }
  >;
  required: boolean;
  placeholder: string;
}

interface MaskaDetail {
  masked: string;
  unmasked: string;
  completed: boolean;
}

export class PhoneInput extends HTMLElement {
  static formAssociated = true;
  private _internals: ElementInternals;
  static observedAttributes = ["required", "class"];

  private options: MaskOptions = {
    mask: "+7 (###) ###-##-##",
    tokens: {
      "#": { pattern: /[0-9]/ },
    } as const,
    required: false,
    placeholder: "+7 000 000 00 00",
  };

  private readonly memo = new Map();
  private readonly eventAbortController: AbortController;
  private inputElement: HTMLInputElement;

  constructor() {
    super();

    this._internals = this.attachInternals();

    this.innerHTML = '<input type="tel" name="phone" />';
    this.inputElement = this.querySelector("input")!;

    this.eventAbortController = new AbortController();
    const { signal }: { signal: AbortSignal } = this.eventAbortController;

    this.inputElement.addEventListener("input", this.onInput, {
      capture: true,
      signal,
    });
    this.inputElement.addEventListener("input", this.onBlur, { capture: true });
  }

  connectedCallback() {
    const maskAttribute = this.getAttribute("mask");
    const placeholder = this.getAttribute("placeholder");

    if (placeholder) {
      this.inputElement.placeholder = placeholder;
    }

    this.options.required = this.hasAttribute("required");

    if (this.options.required) {
      this.inputElement.setAttribute("required", "required");
    }

    if (maskAttribute) {
      this.options.mask = maskAttribute;
    }

    queueMicrotask(() => this.updateValue());
  }

  attributeChangedCallback(name: string, _: string, newValue: string) {
    if (name !== "required") {
      return;
    }

    this.options.required = newValue === "required";

    if (this.options.required) {
      this.inputElement.setAttribute("required", "required");
    } else {
      this.inputElement.removeAttribute("required");
    }

    this.updateValidity();
  }

  public checkValidity(): boolean {
    const inputValue = this.inputElement.value;
    console.log(
      !this.options.required || this.processInput(inputValue).completed,
    );
    return !this.options.required || this.processInput(inputValue).completed;
  }

  public value(): string {
    return this.processInput(this.inputElement.value).unmasked;
  }

  private updateValidity() {
    if (!this.checkValidity()) {
      this._internals.setValidity(
        {
          valueMissing: true,
        },
        "Номер телефона в формате +7хххххххххх",
      );
    } else {
      this._internals.setValidity({});
    }
  }

  private updateValue(): void {
    if (
      this.inputElement.value !== "" &&
      this.inputElement.value !== this.processInput()?.masked
    ) {
      this.setValue(this.inputElement.value);
    }
  }

  private readonly onBlur = (e: Event | InputEvent): void => {
    // check both CustomEvent and isTrusted https://github.com/beholdr/maska/issues/227
    // also check for bubbles because of Safari autofill bug https://github.com/beholdr/maska/issues/238
    if (
      e instanceof CustomEvent &&
      e.type === "input" &&
      !e.isTrusted &&
      !e.bubbles
    ) {
      return;
    }

    this.updateValidity();
  };

  private readonly onInput = (e: Event | InputEvent): void => {
    // check both CustomEvent and isTrusted https://github.com/beholdr/maska/issues/227
    // also check for bubbles because of Safari autofill bug https://github.com/beholdr/maska/issues/238
    if (
      e instanceof CustomEvent &&
      e.type === "input" &&
      !e.isTrusted &&
      !e.bubbles
    ) {
      return;
    }

    const input = e.target as HTMLInputElement;

    const isDelete = "inputType" in e && e.inputType.startsWith("delete");
    this.fixCursor(isDelete, () => this.setValue(input.value));
  };

  private fixCursor(isDelete: boolean, closure: CallableFunction): void {
    const pos = this.inputElement.selectionStart;
    const value = this.inputElement.value;

    closure();

    // if pos is null, it means element does not support setSelectionRange
    // and when cursor at the end, skip non-delete event
    if (pos === null || (pos === value.length && !isDelete)) return;

    const leftPart = value.slice(0, pos);
    const leftPartNew = this.inputElement.value.slice(0, pos);
    const unmasked = this.processInput(leftPart)?.unmasked;
    const unmaskedNew = this.processInput(leftPartNew)?.unmasked;

    if (unmasked === undefined || unmaskedNew === undefined) return;

    let posFixed = pos;

    if (leftPart !== leftPartNew) {
      posFixed += isDelete
        ? this.inputElement.value.length - value.length
        : unmasked.length - unmaskedNew.length;
    }

    this.inputElement.setSelectionRange(posFixed, posFixed);
  }

  private setValue(value: string): void {
    const detail = this.processInput(value);

    if (detail === undefined) return;

    this.inputElement.value = detail.masked;

    this.inputElement.dispatchEvent(
      new CustomEvent<MaskaDetail>("maska", { detail }),
    );
    this.inputElement.dispatchEvent(
      new CustomEvent("input", { detail: detail.masked }),
    );
  }

  private processInput(value?: string): MaskaDetail {
    const valueNew = value ?? this.inputElement.value;

    return {
      masked: this.process(String(valueNew)),
      unmasked: this.process(String(valueNew), false),
      completed: this.process(String(value)).length >= this.options.mask.length,
    };
  }

  private escapeMask(maskRaw: string): { mask: string; escaped: number[] } {
    type Accumulator = {
      chars: string[];
      escaped: number[];
    };

    const { chars, escaped } = [...maskRaw].reduce(
      (acc, ch, i): Accumulator => {
        return ch === "!" && maskRaw[i - 1] !== "!"
          ? {
              ...acc,
              escaped: [...acc.escaped, i - escaped.length],
            }
          : {
              ...acc,
              chars: [...acc.chars, ch],
            };
      },
      { chars: [], escaped: [] },
    );

    return { mask: chars.join(""), escaped };
  }

  private process(value: string, masked = true): string {
    const memoKey = `v=${value},mr=${this.options.mask},m=${masked ? 1 : 0}`;

    if (this.memo.has(memoKey)) return this.memo.get(memoKey);

    const { mask, escaped } = this.escapeMask(this.options.mask);
    const result: string[] = [];

    const check = () => m < mask.length && v < value.length;

    let lastRawMaskChar;
    let m = 0;
    let v = 0;

    while (check()) {
      const maskChar = mask.charAt(m);
      const token = this.options.tokens[maskChar];
      const valueChar = value.charAt(v);

      // mask symbol is token
      if (!escaped.includes(m) && token != null) {
        // value symbol matched token
        if (valueChar.match(token.pattern) != null) {
          result.push(valueChar);
          m += 1;
        } else if (valueChar === lastRawMaskChar) {
          // matched the last untranslated (raw) mask character that we encountered
          // likely an insert offset the mask character from the last entry;
          // fall through and only increment v
          lastRawMaskChar = undefined;
        } else {
          // invalid input
        }

        v += 1;
      } else {
        // mask symbol is placeholder
        if (masked) {
          result.push(maskChar);
        }

        if (valueChar === maskChar) {
          v += 1;
        } else {
          lastRawMaskChar = maskChar;
        }

        m += 1;
      }
    }

    this.memo.set(memoKey, result.join(""));
    return this.memo.get(memoKey);
  }
}
