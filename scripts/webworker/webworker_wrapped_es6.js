export default class WrappedWebWorkerES6 {

    #worker;
    #routes = { };
    
    constructor(url, options = { }) {
        this.#worker = new Worker(url, options);
    }

    get worker( ) {return this.#worker}

    #createRoute(route_key, method) {
        this.#routes[route_key] = function(message) {
            if(message.data.type == route_key) method(message.data.content);
        }
        return this.#routes[route_key];
    }

    setRoute(route_key, method) {
        const route = this.#createRoute(route_key, method);
        this.worker.addEventListener('message', route);
    }

    deleteRoute(route_key) {
        this.worker.removeEventListener('message', this.#routes[route_key]);
    }

    listRoutes( ) {
        return Object.keys(this.#routes);
    }

}
