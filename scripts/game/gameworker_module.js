import WrappedWebWorkerES6 from "../webworker/webworker_wrapped_es6.js";

class GameWorkerES6 extends WrappedWebWorkerES6 {

    constructor( ) {
        super(new URL('worker-driver.js', import.meta.url));
    }

    async createGame(config) {
        await this.sendAsync('game', config);
    }

    sendInput(detail) {
        this.send('game-input', detail);
    }

    stop( ) {
        this.send('game-stop');
    }

    play( ) {
        this.send('game-play');
    }

}

export default new GameWorkerES6( );