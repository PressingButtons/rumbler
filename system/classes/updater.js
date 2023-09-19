export default class Updater {

    #methods = [];

    constructor( ) {
        this.id = requestAnimationFrame(this.#update.bind(this));
    }

    #update( timestamp ) {
        for( const key in this.#methods) this.#methods[key]( );
        this.id = window.requestAnimationFrame(this.#update.bind(this));
    }

    run( key, method ) {
        this.#methods[key] = method;
    }

    stop( key ) {
        delete this.#methods[key];
    }



}