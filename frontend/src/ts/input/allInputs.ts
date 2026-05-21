import { INPUT_CONTEXT } from '../_enum/inputContext';
import { Input } from '../_interface/input';
import { useInputStore } from '@/stores/inputStore';

const angleLeftInput: Input = {
    name: 'Angle Left',
    description: 'Move the angle of the cannon to the left',
    customKeyMap: ['ArrowLeft', '', ''],
    defaultKeyCode: 'ArrowLeft',
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        useInputStore().leftPressed();
    },
    release: () => {
        useInputStore().leftReleased();
    },
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET],
};

const angleRightInput: Input = {
    name: 'Angle Right',
    description: 'Move the angle of the cannon to the right',
    customKeyMap: ['ArrowRight', '', ''],
    defaultKeyCode: 'ArrowRight',
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        useInputStore().rightPressed();
    },
    release: () => {
        useInputStore().rightReleased();
    },
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET],
};

const changeAPSInput: Input = {
    name: 'Change APS',
    description: 'Change the angle per second of the cannon',
    customKeyMap: ['ShiftLeft', '', ''],
    defaultKeyCode: 'ShiftLeft',
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        useInputStore().changeApsPressed();
    },
    release: () => {
        useInputStore().changeApsReleased();
    },
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET],
};

const centerCursorInput: Input = {
    name: 'Set angle to 90°',
    description: 'Set the angle of the cannon to 90°',
    customKeyMap: ['ArrowUp', '', ''],
    defaultKeyCode: 'ArrowUp',
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        useInputStore().centerCursorPressed();
    },
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET],
};

const mirrorCursorInput: Input = {
    name: 'Mirror current Angle',
    description: 'Mirror the angle to the other side.',
    customKeyMap: ['ArrowDown', '', ''],
    defaultKeyCode: 'ArrowDown',
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        useInputStore().mirrorCursorPressed();
    },
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET],
};

const shootInput: Input = {
    name: 'Shoot',
    description: 'Shoot a bubble',
    customKeyMap: ['Space', '', ''],
    defaultKeyCode: 'Space',
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        useInputStore().shootPressed();
    },
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET],
};

const holdInput: Input = {
    name: 'Switch Bubble',
    description: 'Switch a bubble',
    customKeyMap: ['ControlLeft', '', ''],
    defaultKeyCode: 'ControlLeft',
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {        
        useInputStore().holdPressed();
    },
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET],
};

const resetInput: Input = {
    name: 'Restart Game',
    description: 'Restart the game',
    customKeyMap: ['KeyR', '', ''],
    defaultKeyCode: 'KeyR',
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        useInputStore().resetPressed();
    },
    inputContext: [INPUT_CONTEXT.GAME_WITH_RESET, INPUT_CONTEXT.COUNTDOWN],
};

const backInput: Input = {
    name: 'Back',
    description: 'Go back one menu',
    customKeyMap: ['Escape', '', ''],
    defaultKeyCode: 'Escape',
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        useInputStore().backPressed();
    },
    release: () => {
        useInputStore().backReleased();
    },
    inputContext: [INPUT_CONTEXT.GAME_WITH_RESET, INPUT_CONTEXT.COUNTDOWN, INPUT_CONTEXT.MENU],
};

const channelInput: Input = {
    name: 'Open Channel',
    description: 'Open the channel',
    customKeyMap: ['F9', '', ''],
    defaultKeyCode: 'F9',
    isSingleTriggerAction: true,
    pressed: false,
    fire: () => {
        useInputStore().channelPressed();
    },
    inputContext: [INPUT_CONTEXT.MENU],
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
];

export const allKeyCodes = [
    // Alphanumeric keys
    'KeyA',
    'KeyB',
    'KeyC',
    'KeyD',
    'KeyE',
    'KeyF',
    'KeyG',
    'KeyH',
    'KeyI',
    'KeyJ',
    'KeyK',
    'KeyL',
    'KeyM',
    'KeyN',
    'KeyO',
    'KeyP',
    'KeyQ',
    'KeyR',
    'KeyS',
    'KeyT',
    'KeyU',
    'KeyV',
    'KeyW',
    'KeyX',
    'KeyY',
    'KeyZ',

    // Numerical keys
    'Digit0',
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',

    // Function keys
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',

    // Arrow keys
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',

    // Special keys
    'Backspace',
    'Tab',
    'Enter',
    'ShiftLeft',
    'ShiftRight',
    'ControlLeft',
    'ControlRight',
    'AltLeft',
    'AltRight',
    'Pause',
    'CapsLock',
    'Escape',
    'Space',
    'PageUp',
    'PageDown',
    'End',
    'Home',
    'Insert',
    'Delete',
    'PrintScreen',
    'ContextMenu',

    // Numpad keys
    'Numpad0',
    'Numpad1',
    'Numpad2',
    'Numpad3',
    'Numpad4',
    'Numpad5',
    'Numpad6',
    'Numpad7',
    'Numpad8',
    'Numpad9',
    'NumpadAdd',
    'NumpadSubtract',
    'NumpadMultiply',
    'NumpadDivide',
    'NumpadDecimal',
    'NumpadEnter',

    // Media keys
    'MediaPlayPause',
    'MediaStop',
    'MediaTrackPrevious',
    'MediaTrackNext',
    'VolumeUp',
    'VolumeDown',
    'VolumeMute',
    'LaunchMail',
    'LaunchApp1',
    'LaunchApp2',

    // Browser keys
    'BrowserBack',
    'BrowserForward',
    'BrowserRefresh',
    'BrowserStop',
    'BrowserSearch',
    'BrowserFavorites',
    'BrowserHome',

    // Other keys
    'IntlBackslash',
    'IntlRo',
    'IntlYen',
    'IntlHash',
    'IntlPipe',
    'IntlBackquote',
    'AudioVolumeUp',
    'AudioVolumeDown',
    'AudioVolumeMute',
    'LaunchMail',
    'LaunchApp1',
    'LaunchApp2',
    'ProcessKey',
    'Convert',
    'NonConvert',
    'Lang1',
    'Lang2',
    'Lang3',
    'Lang4',
    'Lang5',

    // Additional keys
    'MetaLeft',
    'MetaRight',
    'ContextMenu',

    // Miscellaneous keys
    'ContextMenu',
    'NumpadDecimal',
    'NumpadEnter',
    'NumpadAdd',
    'NumpadSubtract',
    'NumpadMultiply',
    'NumpadDivide',
    'F13',
    'F14',
    'F15',
    'F16',
    'F17',
    'F18',
    'F19',
    'F20',
    'F21',
    'F22',
    'F23',
    'F24',
    'NumLock',
    'ScrollLock',
    'AudioVolumeMute',
    'AudioVolumeDown',
    'AudioVolumeUp',
    'LaunchMediaPlayer',
    'LaunchApplication1',
    'LaunchApplication2',
    'Semicolon',
    'Equal',
    'Comma',
    'Minus',
    'Period',
    'Slash',
    'Backquote',
    'BracketLeft',
    'Backslash',
    'BracketRight',
    'Quote',
];
export const defaultBlocker: Input = {
    name: 'PreventDefault',
    description: 'hehe you cant do this',
    customKeyMap: allKeyCodes,
    defaultKeyCode: '',
    isSingleTriggerAction: true,
    pressed: false,
    fire: /* eslint-disable @typescript-eslint/no-empty-function */ () => {
        /* eslint-enable @typescript-eslint/no-empty-function */
    },
    inputContext: [INPUT_CONTEXT.GAME_NO_RESET, INPUT_CONTEXT.GAME_WITH_RESET],
};
