export default class GameController {

    static DEFAULT_KEYBOARD = ['a', 'd', 'w', 's', 'y', 'u', 'h', 'j', 'i', 'o', 'backspace'];
    static DEFAULT_GAMEPAD = [14, 15, 12, 13, 2, 3, 0, 1, 4, 5, 9];

    #keyboard;
    #gamepad;

    #gamepad = {

    }

    constructor( ) {
        this.type = 'keyboard';
        this.#keyboard = controlScheme
    }

}

const controlScheme = ( left, right, up, down, A, B, C, D, E, F, menu ) => {
    return {
        left: { key: left, value: 0 },
        right: { key: left, value: 0 },
        up: { key: left, value: 0 },
        down: { key: left, value: 0 },
        light: { key: left, value: 0 },
        strong: { key: left, value: 0 },
        jump: { key: left, value: 0 },
        special: { key: left, value: 0 },
        light_strong: { key: left, value: 0 },
        strong_special: { key: left, value: 0 },
    }
}