import { useInputStore } from "@/stores/inputStore";
import { Input } from "../_interface/input";
import { allInputs, defaultBlocker } from "./allInputs";

export function attachInputReader() {
    document.addEventListener("keydown", (event) => handleKeyDown(event));
    document.addEventListener("keydown", (event) => preventDefaults(event));
    document.addEventListener("keyup", (event) => handleKeyUp(event));
    handleHeldDownKeys();

    //reallow ctrl+shift+r or F12 even during gameplay
    document.addEventListener(
        'keydown',
        (event) => {
            if (event.ctrlKey && event.shiftKey && event.code === 'KeyR' || event.code === 'F12') {
                event.stopPropagation();
                return;
            }
        },
        { capture: true }
    );
}

function handleKeyDown(event: KeyboardEvent): void {
    allInputs.forEach((input: Input) => {
        input.customKeyMap.forEach((customCode: string) => {
            if (event.code === customCode && !input.pressed && checkInputContext(input)) {
                event.preventDefault();
                event.stopPropagation();
                input.fire();
                input.pressed = true;
            }
        });
    });
}

function preventDefaults(event: KeyboardEvent): void {
    if (checkInputContext(defaultBlocker)) {
        defaultBlocker.customKeyMap.forEach((customCode: string) => {
            if (event.code === customCode) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }
        });
    }
}

function handleKeyUp(event: KeyboardEvent): void {
    allInputs.forEach((input: Input) => {
        input.customKeyMap.forEach((key: string) => {
            if (event.code === key && checkInputContext(input)) {
                event.preventDefault();
                event.stopPropagation();
                input.pressed = false;
                if (input.release) {
                    input.release();
                }
            }
        });
    });
}

function handleHeldDownKeys(): void {
    allInputs.forEach((input: Input) => {
        if (checkInputContext(input)) {
            if (!input.isSingleTriggerAction && input.pressed) {
                input.fire();
            }
        }
    });
    requestAnimationFrame(() => handleHeldDownKeys());
}

function checkInputContext(input: Input) : boolean {
    return input.inputContext.includes(useInputStore().context);
}