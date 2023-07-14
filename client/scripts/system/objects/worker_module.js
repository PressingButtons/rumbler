export default class WorkerModule {

    #worker;
    #routes;

    constructor(url, options = { }) {
        this.#worker = new Worker(url, options);
        this.#worker.onmessage = this.#onmessage.bind(this);
        this.#routes = { };
    }

    get route_keys( ) {
        return Object.keys(this.#routes);
    }

    #onmessage(event) {
        if(!this.#routes[event.data.route]) return;
        this.#routes[event.data.route].forEach(route => route(event.data.message));
    }

    setRoute( route_key, route_listener, priority = -1 ) {
        if(!this.#routes.hasOwnProperty(route_key))
            this.#routes[route_key] = [ ];
        if(priority < 0) priority = this.#routes[route_key].length;
        this.#routes[route_key].splice(priority, 0, route_listener);
        return this.#routes[route_key].indexOf(route_listener);
    }

    deleteRoute( route_key, route_id = -1 ) {
        if(route_id == -1) delete this.#routes[route_key];
        if(!this.#routes[route_key]) return;
        this.#routes[route_key].splice(route_id, 1);
    }

    sendMessage( route_key, message, transferables ) {
        this.#worker.postMessage({route: route_key, message: message}, transferables);
    }

    sendMessageAsync( route_key, message, transferables = []) {
        const self = this;
        return new Promise((resolve, reject) => {
            const route_id = this.setRoute(route_key, message => {
                self.deleteRoute(route_key, route_id);
                if(message.status == true) resolve(message);
                else reject(message.err);
            });
            this.#worker.postMessage({route: route_key, async: true, message: message}, transferables);
        });
    }

}