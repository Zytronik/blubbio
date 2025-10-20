import { useGameStore } from "@/stores/gameStore";
import { INPUT_CONTEXT } from "../_enum/inputContext";
import { Input } from "../_interface/input";
import { centerCursor, hold, leftDown, leftUp, mirrorAngle, quit, reset, rightDown, rightUp, shoot, toggleAPS } from "../game/actions/thisShouldBeInAllInputs";
import { updateContainerLayout } from "../pixi/container";
import { usePageStore } from "@/stores/pageStore";
import { renderCountdown } from "../animationPixi/countdownAnimation";

export const angleLeftInput: Input = {
    name: "Angle Left",
    description: "Move the angle of the cannon to the left",
    customKeyMap: ["ArrowLeft", "", ""],
    defaultKeyCode: "ArrowLeft",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => leftDown(),
    release: () => leftUp(),
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET]
};

export const angleRightInput: Input = {
    name: "Angle Right",
    description: "Move the angle of the cannon to the right",
    customKeyMap: ["ArrowRight", "", ""],
    defaultKeyCode: "ArrowRight",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => rightDown(),
    release: () => rightUp(),
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET]
};

export const changeAPSInput: Input = {
    name: "Change APS",
    description: "Change the angle per second of the cannon",
    customKeyMap: ["ShiftLeft", "", ""],
    defaultKeyCode: "ShiftLeft",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        toggleAPS();
    },
    release: () => {
        toggleAPS();
    },
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET]
};

export const centerCursorInput: Input = {
    name: "Set angle to 90°",
    description: "Set the angle of the cannon to 90°",
    customKeyMap: ["ArrowUp", "", ""],
    defaultKeyCode: "ArrowUp",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        centerCursor();
    },
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET]
};

export const mirrorCursorInput: Input = {
    name: "Mirror current Angle",
    description: "Mirror the angle to the other side.",
    customKeyMap: ["ArrowDown", "", ""],
    defaultKeyCode: "ArrowDown",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        mirrorAngle();
    },
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET]
};

export const shootInput: Input = {
    name: "Shoot",
    description: "Shoot a bubble",
    customKeyMap: ["Space", "", ""],
    defaultKeyCode: "Space",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        shoot();
    },
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET]
};

export const holdInput: Input = {
    name: "Switch Bubble",
    description: "Switch a bubble",
    customKeyMap: ["ControlLeft", "", ""],
    defaultKeyCode: "ControlLeft",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        hold();
    },
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET]
};

export const resetInput: Input = {
    name: "Restart Game",
    description: "Restart the game",
    customKeyMap: ["KeyR", "", ""],
    defaultKeyCode: "KeyR",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        reset();
    },
    inputContext: [INPUT_CONTEXT.GAME_WITH_RESET]
};

export const backInput: Input = {
    name: "Back",
    description: "Go back one menu",
    customKeyMap: ["Escape", "", ""],
    defaultKeyCode: "Escape",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        quit();
    },
    inputContext: [INPUT_CONTEXT.GAME_WITH_RESET, INPUT_CONTEXT.MENU]
};

export const channelInput: Input = {
    name: "Open Channel",
    description: "Open the channel",
    customKeyMap: ["F9", "", ""],
    defaultKeyCode: "F9",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        usePageStore().toggleCommunityOverlayAnimation();
    },
    inputContext: [INPUT_CONTEXT.MENU]
};


export const pixiDebug1: Input = {
    name: "soloGameplayView",
    description: "asdf",
    customKeyMap: ["Numpad1", "KeyI", ""],
    defaultKeyCode: "Numpad1",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        console.log("pressed debug 1");
        useGameStore().createMonkeyTesting(3);
    },
    inputContext: [INPUT_CONTEXT.MENU, INPUT_CONTEXT.GAME_WITH_RESET, INPUT_CONTEXT.GAME_NO_RESET]
};
export const pixiDebug2: Input = {
    name: "1v1GameplayView",
    description: "asdf",
    customKeyMap: ["Numpad2", "KeyO", ""],
    defaultKeyCode: "Numpad2",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        console.log("pressed debug 2");
        useGameStore().startGame();
    },
    inputContext: [INPUT_CONTEXT.MENU, INPUT_CONTEXT.GAME_WITH_RESET, INPUT_CONTEXT.GAME_NO_RESET]
};
export const pixiDebug3: Input = {
    name: "3ormoreplayers",
    description: "asdf",
    customKeyMap: ["Numpad3", "KeyP", ""],
    defaultKeyCode: "Numpad3",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        console.log("pressed debug 3");
        updateContainerLayout();
    },
    inputContext: [INPUT_CONTEXT.MENU, INPUT_CONTEXT.GAME_WITH_RESET, INPUT_CONTEXT.GAME_NO_RESET]
};
export const pixiDebug4: Input = {
    name: "ShowCountdown",
    description: "asdf",
    customKeyMap: ["Numpad4", "", ""],
    defaultKeyCode: "Numpad4",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        console.log("pressed debug 4");
        renderCountdown();
    },
    inputContext: [INPUT_CONTEXT.MENU, INPUT_CONTEXT.GAME_WITH_RESET, INPUT_CONTEXT.GAME_NO_RESET]
};
export const pixiDebug5: Input = {
    name: "asdf",
    description: "asdf",
    customKeyMap: ["Numpad5", "", ""],
    defaultKeyCode: "Numpad5",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        console.log("pressed debug 5");
        useGameStore().debugLogGameField()
    },
    inputContext: [INPUT_CONTEXT.MENU, INPUT_CONTEXT.GAME_WITH_RESET, INPUT_CONTEXT.GAME_NO_RESET]
};
export const pixiDebug6: Input = {
    name: "asdf",
    description: "asdf",
    customKeyMap: ["Numpad6", "", ""],
    defaultKeyCode: "Numpad6",
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        console.log("pressed debug 6");
        useGameStore().addGarbageToAllInstances(2)
    },
    inputContext: [INPUT_CONTEXT.MENU, INPUT_CONTEXT.GAME_WITH_RESET, INPUT_CONTEXT.GAME_NO_RESET]
};

export const allInputs: Input[] = [
    angleLeftInput,
    angleRightInput,
    changeAPSInput,
    centerCursorInput,
    mirrorCursorInput,
    shootInput,
    holdInput,
    resetInput,
    backInput,
    channelInput,
    pixiDebug1,
    pixiDebug2,
    pixiDebug3,
    pixiDebug4,
    pixiDebug5,
    pixiDebug6,
]

const allKeyCodes = [
    // Alphanumeric keys
    "KeyA", "KeyB", "KeyC", "KeyD", "KeyE", "KeyF", "KeyG", "KeyH", "KeyI", "KeyJ", "KeyK", "KeyL",
    "KeyM", "KeyN", "KeyO", "KeyP", "KeyQ", "KeyR", "KeyS", "KeyT", "KeyU", "KeyV", "KeyW", "KeyX",
    "KeyY", "KeyZ",

    // Numerical keys
    "Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9",

    // Function keys
    "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12",

    // Arrow keys
    "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",

    // Special keys
    "Backspace", "Tab", "Enter", "ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight",
    "AltLeft", "AltRight", "Pause", "CapsLock", "Escape", "Space", "PageUp", "PageDown", "End", "Home",
    "Insert", "Delete", "PrintScreen", "ContextMenu",

    // Numpad keys
    "Numpad0", "Numpad1", "Numpad2", "Numpad3", "Numpad4", "Numpad5", "Numpad6", "Numpad7",
    "Numpad8", "Numpad9", "NumpadAdd", "NumpadSubtract", "NumpadMultiply", "NumpadDivide",
    "NumpadDecimal", "NumpadEnter",

    // Media keys
    "MediaPlayPause", "MediaStop", "MediaTrackPrevious", "MediaTrackNext", "VolumeUp", "VolumeDown",
    "VolumeMute", "LaunchMail", "LaunchApp1", "LaunchApp2",

    // Browser keys
    "BrowserBack", "BrowserForward", "BrowserRefresh", "BrowserStop", "BrowserSearch", "BrowserFavorites",
    "BrowserHome",

    // Other keys
    "IntlBackslash", "IntlRo", "IntlYen", "IntlHash", "IntlPipe", "IntlBackquote", "AudioVolumeUp",
    "AudioVolumeDown", "AudioVolumeMute", "LaunchMail", "LaunchApp1", "LaunchApp2", "ProcessKey",
    "Convert", "NonConvert", "Lang1", "Lang2", "Lang3", "Lang4", "Lang5",

    // Additional keys
    "MetaLeft", "MetaRight", "ContextMenu",

    // Miscellaneous keys
    "ContextMenu", "NumpadDecimal", "NumpadEnter", "NumpadAdd", "NumpadSubtract", "NumpadMultiply",
    "NumpadDivide", "F13", "F14", "F15", "F16", "F17", "F18", "F19", "F20", "F21", "F22", "F23", "F24",
    "NumLock", "ScrollLock", "AudioVolumeMute", "AudioVolumeDown", "AudioVolumeUp", "LaunchMediaPlayer",
    "LaunchApplication1", "LaunchApplication2", "Semicolon", "Equal", "Comma", "Minus", "Period",
    "Slash", "Backquote", "BracketLeft", "Backslash", "BracketRight", "Quote"
];
export const defaultBlocker: Input = {
    name: "PreventDefault",
    description: "hehe you cant do this",
    customKeyMap: allKeyCodes,
    defaultKeyCode: "",
    isSingleTriggerAction: true,
    pressed: false,
    fire: /* eslint-disable @typescript-eslint/no-empty-function */ () => { /* eslint-enable @typescript-eslint/no-empty-function */ },
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET,]
}