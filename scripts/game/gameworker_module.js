import WrappedWebWorkerES6 from "../webworker/webworker_wrapped_es6.js";

export default class GameWorkerES6 extends WrappedWebWorkerES6 {

    constructor( ) {
        super(new URL('gameworker_script-main.js', import.meta.url));
    }

    init(bitmaps) {
        return this.sendAsync('maps', bitmaps, Object.values(bitmaps));
    }

    createGame(config) {
        return this.sendAsync('create', config);
    }

}