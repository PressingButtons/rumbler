export default class SignalObject {
    #hooks = { };

    constructor( ) {}

    /**
     * 
     * @param {String} key 
     * @param {Function} method 
     * Sets key to contain methods that will be executed on signal
     */
    setHook(key, method) {
        if(!this.#hooks[key]) this.#hooks[key] = [];
        this.#hooks[key].push(method);
    }

    /**
     * 
     * @param {String} key 
     * @param {object} options 
     * @returns {void}
     * executes all functions associated with key with options
     */
    signal(key, options) {
        const hook = this.#hooks[key];
        if(!hook) return;
        for(const method of hook) method(options);
    }

    signalAsync(key, options) {
        if(!this.#hooks[key]) return;
        const promises = this.#hooks[key].map(async x => await x(options));
        return Promise.all(promises)

    }
}