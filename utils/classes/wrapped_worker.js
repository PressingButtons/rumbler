import AutoIncrement from "../components/es6.auto_increment.js";

export default class WrappedWorker {

    #messages = { };
    #message_indexer = new AutoIncrement( );
    worker;
    #routes = { }

    constructor( url ) {
        this.worker = new Worker( url );
        this.#init( );
    }

    #init( ) {
        const messages = this.#messages;
        const self = this;
        this.worker.addEventListener('message', function(event) {
            if( event.data.id != undefined ) self.#handlePromise( event.data );
            else if( event.data.route ) self.#handleRoute( event.data );
        });
    }

    #createMessage( route, content) {
        return { route: route, content: content, id: this.#message_indexer.next( ) }
    }

    #handlePromise( data ) {
        const promise = this.#messages[data.id];
        if(!promise) return;
        if( data.success ) promise.resolve(data.content);
        else promise.reject(data.content);
    }

    #handleRoute( data ) {
        const route = this.#routes[data.route];
        if( !route ) return;
        route( data.content );
    }

    #send( message, transferables = null) {
        const worker = this.worker;
        const messages = this.#messages;
        return new Promise(function(resolve, reject) {
            worker.postMessage( message, transferables );
            messages[message.id] = { resolve: resolve, reject: reject }
        });
    }

    sendMessage( route, content, transferables = null) {
        const message = this.#createMessage( route, content );
        return this.#send( message, transferables );
    }

    setRoute( route, func) {
        this.#routes[route] = func;
    }

}