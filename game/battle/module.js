import WrappedWorker from "../../utils/classes/wrapped_worker.js";

export default class BattleModule extends WrappedWorker {

    constructor( system ) {
        super(new URL('./engine.js', import.meta.url));
        this.#setRoutes( );
        this.#setListeners( system );
    }

    #setListeners( system ) {
        for(var pad in system.virtual_pads ) 
            this.#setPadListener( pad, system.virtual_pads[pad] );
    }

    #setPadListener( id, pad ) {
        pad.addEventListener('button-pressed', event => {
            this.sendMessage('input', { pad: pad.controls( ), source: id })
        });

        pad.addEventListener('button-released', event => {
            this.sendMessage('input', { pad: pad.controls( ), source: id })
        });
    }


    #setRoutes( ) {
        // process incoming instances 
        this.setRoute('instance', function( message ) {
           this.oninstance( message );
        }.bind( this ));
    }

    // create the scenario based on the build
    async build( build ) {
        await this.sendMessage( 'create', build );
    }

    close( ) {
        return this.sendMessage('close');
    }

    play( ) {
        return this.sendMessage('play');
    }

    stop( ) {
        return this.sendMessage('stop');
    }

    oninstance( instance ) { }

}