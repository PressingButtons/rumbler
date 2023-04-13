class Player {

    #active = false;
    #rumbler;
    #input_buffer;

    constructor( ) {
        this.#input_buffer = {
            right: false, left: false, down: false, up: false,
            a: false, b: false, c: false, d: false
        }
    }

    get active( ) {
        return this.#active;
    }

    activate(player) {
        this.#rumbler = spawn(player);
    }

    updateInput(input) {
        for(const key in input) 
            if(this.#input_buffer[key])
                this.#input_buffer[key] = input[key];
    }

    update(config) {
        config.input = 
        this.#rumbler.update(config)
    }

}
