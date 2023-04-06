import WrappedWebWorkerES6 from "../webworker/webworker_wrapped_es6.js";

export default class GameWorkerES6 extends WrappedWebWorkerES6 {

    constructor( ) {
        super(new URL('game_worker_main_script.js', import.meta.url));
    }

}