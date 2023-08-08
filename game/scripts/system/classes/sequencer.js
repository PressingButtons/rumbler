export default class Sequencer extends EventTarget {

    #current;

    constructor( ) {
        super( );
    }

    #switchSequence( sequence, options = { } ) {
        if( this.#current ) this.#current.exit( options.onExit );
        this.#current = sequence;
        sequence.enter( options.onEnter );
    }

    addSequence( sequence ) {
        this.addEventListener( sequence.name, event => this.#switchSequence( sequence, event.detail ));
        sequence.sequencer = this;
    }

}