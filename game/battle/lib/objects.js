// None Game Specfic Objects 
const Objects = { };
// ================================
//  Signal Object - Enables Channeling functions 
// ================================
Objects.SignalObject = class {

    #channels = { };

    constructor( ) {

    }

    #createChannel( name ) {
        this.#channels[name] = [];
    }

    #addToChannel( name, func, priority ) {
        this.#channels[name].push({ method: func, priority: priority });
        this.#channels[name].sort((a, b) => {return a.priority - b.priority});
    }

    setChannel( name, func, priority = undefined) {
        if( !this.#channels[name] ) this.#createChannel( name );
        priority = isNaN( priority ) ? this.#channels[name].length : priority;
        this.#addToChannel( name,  func, priority );
    }

    setSignal( name, func ) {
        this.#channels[name] = [{method: func}];
    }

    signal( channels, options ) {
        if( channels == null ) return;
        if( channels instanceof Array ) {
            //handle array
            for(const channel of channels) this.signal( channel, options );
        } else {
            // handle channel name
            if(! this.#channels[channels] ) return;
            for( const ch of this.#channels[channels]) {
                ch.method( options );
            }   
        }
    }

}
// ================================
// Sequence - A Template used as a route for Sequencers / provides ecapulation
//            While maintaining reference to the host
// ================================
Objects.Sequence = class {
    #name;

    constructor( name ) {
        this.#name = name;
        this.sequencer;
    }

    get name( ) {
        return this.#name;
    }

    enter( ) {

    }

    exit( ) {

    }

    run( ) {

    }
}
// ================================
//  Sequencer - Hoster of Sequences - each an encapulated set of code
// ================================
Objects.Sequencer = class extends Objects.SignalObject {
    #sequences = { };
    #current = null;

    constructor( ) {
        super( );
    }

    get current( ) {
        return this.#sequences[this.#current];
    }

    async #switchSequence( sequence, options = {}) {
        if( !sequence ) return;
        if( this.current ) await this.current.exit( options.on_exit);
        await sequence.enter( options.on_enter );
    }

    createSequence( name, onCreate) {
        this.#sequences[name] = new Objects.Sequence( name );
        this.#sequences[name].signal = this.goToSequence.bind(this);
        this.#sequences[name].host = this;
        if( onCreate ) onCreate(this.#sequences[name]);
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
