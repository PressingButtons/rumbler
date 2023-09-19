import Sequence from "./sequence.js";

export default class Sequencer {

    #sequences = { };
    #current = null;

    constructor( ) {
    }

    get current( ) {
        return this.#sequences[this.#current];
    }

    async #switchSequence( sequence, options = {}) {
        if( !sequence ) return;
        if( this.current ) await this.current.exit( options.on_exit);
        await sequence.enter( options.on_enter );
    }

    createSequence( name ) {
        this.#sequences[name] = new Sequence( name );
        this.#sequences[name].signal = this.goToSequence.bind(this);
        this.#sequences[name].host = this;
        return this.#sequences[name];
    }

    setSequence( sequence ) {
        this.#sequences[sequence.name] = sequence;
        sequence.host = this;
    }

    goToSequence( name, options ) {
        return new Promise(async (resolve, reject) => {
            const sequence = this.#sequences[name];
            if( !sequence ) reject( 'Invalid Sequenece: ' + name);
            resolve( await this.#switchSequence(sequence, options));
        });
    }

}