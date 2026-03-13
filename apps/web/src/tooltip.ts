import { computePosition, flip, shift, offset } from "@floating-ui/dom";

function showTooltip(tooltipElement: HTMLDivElement, buttonElement: HTMLButtonElement,) {
    tooltipElement.style.display = 'block';

    computePosition(buttonElement, tooltipElement, {
        placement: "bottom-start",
        middleware: [offset(6), flip(), shift({ padding: 5 })],
    }).then(({ x, y }) => {
        Object.assign(tooltipElement.style, {
            left: `${x}px`,
            top: `${y}px`,
        });
    });
}

function hideTooltip(tooltipElement: HTMLDivElement) {
    tooltipElement.style.display = "none"
}

export function initTooltips() {
    const listeners = {
        'mouseenter': showTooltip,
        'focus': showTooltip,
        'mouseleave': hideTooltip,
        'blur': hideTooltip
    } as const;

    const tooltipButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.form-info-button')

    const tooltips = [...tooltipButtons].map(buttonElement => {
        const tooltipElement: HTMLDivElement = buttonElement.parentElement!.querySelector('.form-info-tooltip')!
        return {
            buttonElement,
            tooltipElement
        }
    })

    for (const { buttonElement, tooltipElement } of tooltips) {
        for (const [event, handler] of Object.entries(listeners)) {
            buttonElement.addEventListener(event, () => handler(tooltipElement, buttonElement))
        }
    }
}
