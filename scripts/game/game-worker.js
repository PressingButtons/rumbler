import WorkerModule from "../system/objects/worker_module.js";

export default class GameWorker extends WorkerModule {

    constructor( ) {
        super('/scripts/game/game-worker.js');
    }

}