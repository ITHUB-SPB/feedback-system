import State from "../state";

const template = document.createElement("template");

template.innerHTML = `
    <style>
        :host {
            visibility: "hidden";
        }

        .view_issues {
            padding: 0 0.75rem;
            border: 2px solid #18a763;
            border-radius: 1rem;
            margin-left: auto;
            background-color: white;
            color: #18a763;
            font-size: 1.2rem;
            font-weight: bold;
        }

        .view_issues:hover {
            cursor: pointer;
        }
    </style>

    <button type="button" class="view_issues">

    </button>
`;

export class IssuesCounter extends HTMLElement {
  private state: State | null;
  private buttonElement: HTMLButtonElement;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.state = null;
    this.buttonElement = shadowRoot.querySelector("button")!;
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    // (3)
    return ["projectid"];
  }

  attributeChangedCallback(name: string) {
    if (name === "projectid") {
      this.render();
    }
  }

  public connectState(state: State) {
    this.state = state;
  }

  private render() {
    const projectId = this.getAttribute("projectid") || "undefined";

    if (projectId === "undefined" || projectId === "") {
      this.style.visibility = "hidden";
      return;
    }

    const issuesByProject =
      this.state?.issuesByAllProjects[Number(projectId)] ?? [];
    const issuesCount = issuesByProject?.length;

    if (issuesCount) {
      this.buttonElement.textContent = `${issuesCount.toString()} ${this.declOfNum(issuesCount)}`;
    }
    this.style.visibility = issuesCount ? "visible" : "hidden";
  }

  private declOfNum(number: number) {
    const cases = [2, 0, 1, 1, 1, 2] as const;
    const titles = ["предложение", "предложения", "предложений"] as const;

    if (number % 100 > 4 && number % 100 < 20) {
      return titles[2];
    } else if (number % 10 < 5) {
      const titleIx = cases[number % 10] as number;
      return titles[titleIx];
    } else {
      return titles[cases[5]];
    }
  }
}
