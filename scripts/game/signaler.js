//==========================================================
// Signaler class 
// Global class - used to bind actions to certain signals
//==========================================================
self.Signlar = class {

    #routes = { };

    constructor( ) {

    }

    setRoute( key, method ) {
        if(!this.#routes[key]) this.#routes[key] = [];
        this.#routes[key].push(method);
    }

    deleteRoute( key ) {
        delete this.#routes[key];
    }

    deleteRouteMethod( key, method ) {
        if( this.#routes[key] ) this.#routes[key].splice( this.routes[key].indexOf( method ), 1);
    }

    signal( key, options ) {
        if(!this.#routes[key]) return;
        for(const method of this.#routes[key]) method(options);
    }

}