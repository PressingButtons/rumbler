export default class VirtualController {

    #map = { }

    constructor( ) { 
        return this;
    }

    #setValue(key, value) {
        if(this.#map[key])
            this.#map[key].value = value;
    }

    #setGamepadValues(values) {
        for(const key in this.#map) {
            this.#map[key].value = values[key];
        }
    }

    map(keys) {
        for(const key in keys) {
            const trigger = keys[key];
            this.#map[trigger] = { key: key, value: 0};
        }
        return this;
    }

    set(config) {
        if(config.type =='keyboard') this.#setValue(config.key, config.value);
        else this.#setGamepadValues(config.value);
        return this;
    }

    serialize( ) {
        let result = { };
        for(let id in this.#map) {
            const button = this.#map[id];
            result[button.key] = button.value;
        }
        return result;
    }

    DEFAULT_KEYBOARD ( ) {
        this.map({left: 'a', right: 'd', up: 'w', down: 's', a: 'y', b: 'h', c: 'u', d: 'j', e: 'i', f: 'k', start: 'backspace', select: 'p'});
        return this;
    }

    DEFAULT_PLAYSTATION ( ) {
        this.map({left: 14, right: 15, up: 12, down: 13, a: 2, b: 0, c: 3, d: 1, e: 4, f: 5, start: '9', select: '8'});
        return this;
    }

}
