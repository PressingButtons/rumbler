class SignalObject {

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

    signal( channel_name, options ) {
        if(! this.#channels[channel_name] ) return;
        for( const channel of this.#channels[channel_name]) {
            channel.method( options );
        }
    }

}