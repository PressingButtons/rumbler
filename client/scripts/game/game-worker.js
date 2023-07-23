import WorkerModule from "../system/objects/worker_module.js";

export default class GameWorker extends WorkerModule {

    constructor( ) {
        super('/scripts/game/game-main.js');
    }

    async createGame( graphics ) {
        let test = await this.sendMessageAsync('create-game', { });
    }

    sendInput( input ) {
        this.sendMessage( 'input', input );
    }

}