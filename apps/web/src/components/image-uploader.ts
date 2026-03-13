const template = document.createElement('template')

template.innerHTML = `
<style>

:host {
  --grey: #f9f9f9;
  --font-color: #333;
  --white: #fff;
  --border-color: #b6b6b2ff;
  --black: #333;
  --hover: #777;
  --green: #18a763;
  --input-height: 40px;
  --image-preview-height: 180px;
  --border-radius: 4px;
  --box-shadow: 0 4px 10px 0 rgba(33, 33, 33, 0.25);

  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: var(--grey);

  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px !important;
  text-align: center;
  transition: all 0.3s ease;
}

host * {
    box-sizing: border-box;
}

.input-container {
    height: var(--input-height);
    position: relative;
    width: 180px;
}

.input-container:hover {
    cursor: pointer;
}

.input-hidden {
    height: var(--input-height);
    margin: 0;
    width: 100%;
    opacity: 0;
}

.input-visible {
    background-clip: padding-box;
    background-color: var(--green);
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    color: var(--white);
    font-size: 16px;
    line-height: 1.5;
    overflow: hidden;
    padding: 8px 12px;
    position: absolute;
    right: 0;
    top: 0;
    left: 0;
    user-select: none;
    z-index: 5;
}

.image-preview {
    border-radius: var(--border-radius);
    height: var(--image-preview-height);
    overflow: auto;
    padding: 4px;
    transition: background 0.2s ease-in-out;
    width: 100%;
}

.image-preview-item {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    float: left;
    height: 90px;
    margin: 1.858736059%;
    position: relative;
    transition: background 0.2s ease-in-out, opacity 0.2s ease-in-out;
    width: 29.615861214%;
}

.image-preview-item.multi-item-clear-animation {
    opacity: 0;
}

.image-preview-item-clear {
    background: var(--grey);
    border-radius: 50%;
    box-shadow: var(--box-shadow);
    height: 20px;
    left: -6px;
    margin-top: -6px;
    position: absolute;
    text-align: center;
    transition: background 0.2s ease-in-out, color 0.2s ease-in-out;
    width: 20px;
}

.image-preview-item-clear:hover {
    background: var(--grey);
    cursor: pointer;
}

.image-preview-item-clear-icon {
    color: var(--font-color);
    display: block;
    margin-top: 4px;
    font-weight: bold;
}
</style>

<div class="image-preview"></div>
<label class="input-container">
<input
    aria-label="Choose File"
    class="input-hidden"
    type="file"
/>
<span class="input-visible">Загрузить</span>
</label>
`

enum Events {
    IMAGE_ADDED = 'fileUploadWithPreview:imagesAdded',
    IMAGE_DELETED = 'fileUploadWithPreview:imageDeleted',
    IMAGE_MULTI_ITEM_CLICKED = 'fileUploadWithPreview:imageMultiItemClicked',
}

const DEFAULT_BASE_IMAGE =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAiQAAAD6CAMAAACmhqw0AAAA+VBMVEUAAAD29u3u7unt7ent7enu7uju7uihoqCio6Gio6KjpKOkpaSmpqSmp6WoqKaqq6mqq6qrq6qsrautrauur62wsa6xsa+xsrCys7GztLK0tbK1trS2t7S3t7W4uba5ure6u7e7vLm8vbu9vrvAwL3Awb3DxMHFxcPGxsPHx8TIycXLzMjLzMnMzMnNzsrPz8vP0MzQ0M3S0s/U1NDV1dLX19TY2NTY2NXZ2dba2tXb29bc3Nfc3Njc3dnd3dre3tre39vg4Nvh4dzi4t3i4t7j497k5N/k5ODl5eDl5eHl5uLm5uHn5+Lo6OPp6eTq6uXr6+bs7Oft7eh54KxIAAAAB3RSTlMAHKbl5uztvql9swAABA1JREFUeNrt3VlT01AYgOG0oEEE910URNzFBVFcqCgKirLU/P8fI3QYbEOSdtrMyJzzvHfMlFx833NBQuY0SRrN8UwqabzZSJLGaYNQVacaSdMUVF0zGTMEVTeWmIH6BYkgESSCRJAIEkEiSCRIBIkgESSCRJAIEkEiQSJIBIkgESSCRJAIEgkSQSJIBIkgESSCRJBIkAgSQSJIBIkgESSCRIJEkAgSQSJIBIkgkSARJIJEkAgSQSJIBIkEiSARJIJEkAgSQSJIJEgEiSARJIJEkAgSQSJBIkgEiSARJIJEkAgSCRJBIkgEiSARJIJEgkSQ5PvxbdS+tyEJuZVb0+noTV579geSQGs/SOvqxiYkYfYwra+rbUhC7NNEjUjSJ5CE2P06jaTnIAmxKwe7vb468t3N14WOki1IAuzMwWrf1HCh3Q6S95AEWGe1b0/WlSCBBBJIIAkdSXvt1aNXa21IICld7dJU5+epJUggKV7tzuzRA4/ZHUggKVrtfNdjsXlIIClY7XLPw9NlSCA5vtqLPUguQgLJsdX+zv0fZhsSSPKrXckhWSn5jV8zG5DEiuR1DsnrEiOX0vMbkESKZDWHZLXMSFqsBJIIkOz1vn40sVdqpFgJJDHc3dzsQXKzwkihEkhiQLI+2f3y+3qVkSIlkMSAJFvsQrJYbaRACSRRIMlenj0UcPZlPyPHlUASB5Jsc+7cwevMc5v9jRxTAkkkSPbb+riVZYMYySuBJB4kJRUYySmBJHYkhUZ6lUASOZISIz1KIIkbSamRbiWQxIZkvT2YkS4lkESGpDV9tz2YkX9KIIkLSWs6TY+U9DFypASSqJC0OicfHSrpa2T/k5BEh6R1eDpWR8kARtIZSGJD0jo6QW1fySBGIIkOSavrlL27PwcxAklsSFo9JzFOppBAkl9ta5jTOiGJCslQRiCJCslwRiCJCcmQRiCJCMmwRiCJB8mXoU+YhyQaJM9TSCCBBBJIIIEEEkgggQQSSCCJAsnyzLA9hiQWJCfnSpBAAgkkkATXxFCnPxfU7iB5B0mAXT5Y7Z3t0Y087SDZgCTA7tX6bZ5TGSQBtlwrkgVIgmy+RiMXdiEJsp3b9Rn5nEESaC/O1/P3yMJuBkm4bX94O2rvNiKbWXRIBIkgESSCRJAIEkEiQSJIBIkgESSCRJAIEgkSQSJIBIkgESSCRIJEkAgSQSJIBIkgESQSJIJEkAgSQSJIBIkgkSARJIJEkAgSQSJIBIkEiSARJIJEkAgSQSJIJEgEiSARJIJEkAgSCRJBIkgEiSARJIJEkEiQCBJBIkgEiSARJIJEgkSQCBJBIkgEiSARJBIkgkSQ6P8gGTMDVTeWNA1B1TWTxmlTUFWnGknSaI4bhMoabzaSv+4BHFVoHZzfAAAAAElFTkSuQmCC';

const MULTI_ITEM_CLEAR_ANIMATION_CLASS = 'multi-item-clear-animation';

interface ImageAddedEvent {
    detail: {
        addedFilesCount: number;
        cachedFileArray: File[];
        files: FileList | File[];
    };
}

interface ImageDeletedEvent {
    detail: {
        cachedFileArray: File[];
        currentFileCount: number;
        index: number;
    };
}

interface Options {
    /**
     * Type of files to accept in your input
     *
     * @default 'image/*'
     */
    accept: HTMLInputElement['accept'];
    /**
     * Set a maximum number of files you'd like the component to deal with. Must be `>= 0` if set. By default there is no limit.
     *
     * @default 0
     */
    maxFiles: number;
    /**
     * Is field required to fill
     *
     * @default false
     */
    required: boolean;
}

const generateUniqueId = () => Math.random().toString(16).slice(2);

export class ImageUploader extends HTMLElement {
    static formAssociated = true;
    private _internals: ElementInternals;

    private userInteracted: boolean = false;
    private cachedFileArray: File[] = [];
    private imagePreview: HTMLDivElement;
    private inputHidden: HTMLInputElement;
    private inputVisible: Element;

    private options: Options = {
        accept: 'image/*',
        maxFiles: 0,
        required: false,
    };

    static observedAttributes = ["required"]

    constructor() {
        super()

        this._internals = this.attachInternals()

        const shadowRoot = this.attachShadow({ mode: "open" })
        shadowRoot.appendChild(template.content.cloneNode(true))

        this.cachedFileArray = [];
        this.inputHidden = shadowRoot.querySelector('.input-hidden') as HTMLInputElement;
        this.inputVisible = shadowRoot.querySelector('.input-visible') as HTMLInputElement;
        this.imagePreview = shadowRoot.querySelector('.image-preview') as HTMLDivElement;

        this.bindEvents();
    }

    connectedCallback() {
        this.options.maxFiles = Number(this.getAttribute('maxfiles')) || 0;
        this.options.accept = this.getAttribute('accept') ?? "image/*";
        this.options.required = this.hasAttribute('required');

        if (this.options.maxFiles === 1) {
            this.inputHidden.setAttribute("multiple", "multiple")
        }

        if (this.options.required) {
            this.inputHidden.setAttribute("required", "required")
        }

        this.inputHidden.setAttribute("accept", this.options.accept)

        this.updateValidity()
    }

    attributeChangedCallback(name: string, _: string, newValue: string) {
        if (name !== "required") {
            return
        }

        this.options.required = newValue === "required"

        if (this.options.required) {
            this.inputHidden.setAttribute('required', 'required')
        } else {
            this.inputHidden.removeAttribute('required')
        }

        this.updateValidity()
    }

    public get selectedFiles() {
        return this.cachedFileArray
    }

    public checkValidity(): boolean {
        return !this.userInteracted || !this.options.required || this.selectedFiles.length > 0
    }

    private bindEvents() {
        this.inputHidden.addEventListener(
            'change',
            (e) => {
                this.userInteracted = true;
                const target = e.target as HTMLInputElement;
                if (target.files == null) return;

                this.addFiles(target.files);
                target.value = '';
                this.updateValidity()
            },
            true,
        );

        this.imagePreview.addEventListener('click', (e) => {
            const target = e.target as HTMLDivElement;

            if (!target.matches('.image-preview-item-clear-icon')) return;

            const fileName = target.getAttribute('data-upload-name');
            const selectedFileIndex = this.cachedFileArray.findIndex(({ name }) => name === fileName);
            this.deleteFileAtIndex(selectedFileIndex);
            this.updateValidity()
        });
    }

    private updateValidity() {
        if (!this.checkValidity()) {
            this._internals.setValidity({
                valueMissing: true
            }, "Отсутствуют изображения")
            this._internals.reportValidity()
        } else {
            this._internals.setValidity({})
        }
    }

    private checkFiles(files: FileList | File[]) {
        const allowedImageTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/heic",
        ];

        type Accumulator = {
            invalidFiles: File[],
            validFiles: File[]
        }

        return Array.from(files).reduce((acc: Accumulator, file) => {
            const isValidImageType = allowedImageTypes.includes(
                file.type.toLowerCase(),
            );
            const fileExtension = file.name.toLowerCase().split(".").pop();
            const allowedExtensions = ["jpg", "jpeg", "png", "webp", "heic"];

            const isValidExtension =
                fileExtension && allowedExtensions.includes(fileExtension);

            return !isValidImageType && !isValidExtension ? {
                ...acc,
                invalidFiles: [...acc.invalidFiles, file]
            } : {
                ...acc,
                validFiles: [...acc.validFiles, file]
            }
        }, {
            validFiles: [],
            invalidFiles: [],
        });
    }

    private addFiles(files: FileList | File[]) {
        if (!files.length) return;

        const { validFiles, invalidFiles } = this.checkFiles(files)

        if (invalidFiles.length) {
            const invalidFileNames = invalidFiles.map(({ name }) => name).join(", ")
            const message = (
                `Неподдерживаемый формат файлов:\n ${invalidFileNames}.\n Пожалуйста, загружайте только изображения (JPG, PNG, WebP, HEIC).`
            );
            this.dispatchEvent(new CustomEvent("image-uploader:error", { detail: message, composed: true, bubbles: true }))
        }

        let fileArray = Array.from(validFiles);

        if (this.options.maxFiles > 1) {
            const totalFileCount = this.cachedFileArray.length + fileArray.length;
            const differenceFromMax = totalFileCount - this.options.maxFiles;

            if (differenceFromMax > 0) {
                fileArray = fileArray.slice(0, fileArray.length - differenceFromMax);
            }
        }

        if (this.options.maxFiles === 1) {
            this.cachedFileArray = [];
        }

        fileArray.forEach((file) => {
            const fileWithUniqueName = new File(
                [file],
                `${file.name || 'fallback-name'}${generateUniqueId()}`,
                {
                    type: file.type,
                },
            );

            this.cachedFileArray.push(fileWithUniqueName);
            this.addFileToPreviewPanel(fileWithUniqueName);
        });

        const eventPayload: ImageAddedEvent = {
            detail: {
                addedFilesCount: fileArray.length,
                cachedFileArray: this.cachedFileArray,
                files,
            },
        };

        window.dispatchEvent(new CustomEvent(Events.IMAGE_ADDED, eventPayload));
    }

    private addFileToPreviewPanel(file: File) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
            if (this.options.maxFiles === 1) {
                const backgroundImage = reader.result ? `url("${reader.result}")` : DEFAULT_BASE_IMAGE
                this.imagePreview.style.backgroundImage = backgroundImage;
                return;
            }

            const backgroundImage = reader.result ?? DEFAULT_BASE_IMAGE

            this.imagePreview.innerHTML += `
        <div
          class="image-preview-item"
          data-upload-name="${file.name}"
          style="background-image: url('${backgroundImage}'); "
        >
            <span class="image-preview-item-clear">
                <span class="image-preview-item-clear-icon" data-upload-name="${file.name}">
                    &times;
                </span>
            </span>
        </div>
      `;
        };
    }

    private deleteFileAtIndex(index: number) {
        this.cachedFileArray.splice(index, 1)
        this.refreshPreviewPanel();

        const eventPayload: ImageDeletedEvent = {
            detail: {
                cachedFileArray: this.cachedFileArray,
                currentFileCount: this.cachedFileArray.length,
                index,
            },
        };

        window.dispatchEvent(new CustomEvent(Events.IMAGE_DELETED, eventPayload));
    }

    private refreshPreviewPanel() {
        const imagePreviewItems = this.imagePreview.querySelectorAll('.image-preview-item');

        Array.from(imagePreviewItems)
            .forEach((item) => item.classList.add(MULTI_ITEM_CLEAR_ANIMATION_CLASS));

        // Use the setTimeout to process images after the MULTI_ITEM_CLEAR_ANIMATION_CLASS is done
        setTimeout(() => {
            this.imagePreview.innerHTML = '';

            // Reset the panel if there are no files
            if (!this.cachedFileArray.length) {
                this.resetPreviewPanel();
                return;
            }

            this.cachedFileArray.forEach((file) => this.addFileToPreviewPanel(file));
        }, 200);
    }

    private resetPreviewPanel() {
        this.inputHidden.value = '';
        this.imagePreview.innerHTML = '';
        this.cachedFileArray = [];
    }
}