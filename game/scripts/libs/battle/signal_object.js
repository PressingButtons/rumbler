class SignalObject {

    #signals = { };

    constructor( ) {

    }

    onSignal( signal, func ) {
        if( !this.#signals[ signal ] ) 
            this.#signals[signal] = [ ];
        if( this.#signals[signal].indexOf( func ) == - 1)
            this.#signals[signal].push( func );
    }

    unSignal( signal, func ) {
        if(!this.#signals[signal] ) return;
        const index = this.#signals[signal].indexOf( func );
        if( index > -1) this.#signals[signal].splice(index, 1);   
    }

    removeSignal( signal ) {
        delete this.#signals[signal];
    }

    signal( phrase, options ={ }) {
        if(!this.#signals[phrase]) return;
        for(const func of this.#signals[phrase])
            func( options );
    }

}