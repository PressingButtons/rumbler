import WrappedWorker from "../../utils/classes/wrapped_worker.js";

export default class BattleInstance extends WrappedWorker {

    constructor( options ) {
        super(new URL('./battle_worker.js'));
        this.setRoute( 'instance', this.#handleInstance.bind(this));
        this.sendMessage('create', options);
    }

    #handleInstance( instance ) {
        this.onInstance( instance );
    }

    setup( config ) {
        return this.sendMessage('setup', config );
    }

    stop( ) {
        this.sendMessage('stop');
    }

    run( ) {
        this.sendMessage('run');
    }

    close( ) {
        this.sendMessage('close');
    }

    sendInput( config ) {
        this.sendMessage('input', config );
    }

    onInstance( ) {

    }

}