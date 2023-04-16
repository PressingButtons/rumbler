export default class VirtualController {

    #buttons = new Uint8Array(12);
    #map = {up: 0, down: 1, left: 2, right: 3, a: 4, b: 5, c: 6, d: 7, e: 8, f: 9, start: 10, select: 11}

    constructor( ) { }

    #setValue(key, value) {
        this.#buttons[map][key] = value;
    }

    map(keys) {
        Object.assign(this.#map, keys);
    }

    set(config) {
        if(config.type=='keyboard') this.#setValue(config.key, config.value);
        else this.#buttons.set(config.value);
    }

    serialize( ) {
        let result = { };
        for(let id in this.#map) result[id] = this.#buttons[this.#map[id]];
        return result;
    }

    static DEFAULT_KEYBOARD ( ) {
        this.map({left: 'a', right: 'd', up: 'w', down: 's', a: 'y', b: 'h', c: 'u', d: 'j', e: 'i', f: 'k', start: 'backspace', select: 'p'});
    }

    static DEFAULT_PLAYSTATION ( ) {
        this.map({left: 14, right: 15, up: 12, down: 13, a: 2, b: 0, c: 3, d: 1, e: 4, f: 5, start: 'backspace', select: 'p'});
    }

}
