export default class Sequence extends EventObject {

    #name;
    #current;
    #sub_sequences = { };

    /**
     * 
     * @param {String} name 
     * @param {Function} enter 
     * @param {Function} exit 
     */
    constructor(name, enter, exit) {
        this.#name;
        this.enter = enter || function( ) { };
        this.exit = exit || function( ) { };
    }

    get current( ) {return this.#current;}

    #createListener(key) {
        const self = this;
        return function(event) {
            if(event.type != key || event.type == self.#current) return;
            if(self.#current) self.#sub_sequences[self.#current].sequence.exit(event.detail.on_exit);
            self.#sub_sequences[key].sequence.enter(event.detail.on_enter);
        }
    } 
 
    create(key, on_enter, on_exit) {
        const self = this;
        const sequence = new Sequence(key, on_enter, on_exit);
        const listener = this.#createListener(key);
        this.addEventListener(key, listener);
        this.#sub_sequences[key] = {sequence: sequence, listener: listener};
        return sequence;
    }

    destroy(key) {
        this.removeEventListener(key, this.#sub_sequences[key].listener);
        delete this.#sub_sequences[key];
    }

}
