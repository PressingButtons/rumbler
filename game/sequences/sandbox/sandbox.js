import BattleModule from "../../battle/module.js";
import SandboxUI from "./sandbox-ui.js"

export default function seqSandbox( sequence ) {

    sequence.enter = async function( config ) {
        //load sandbox ui
        this.ui = new SandboxUI( );
        await this.ui.load( this );
        this.host.virtual_pads.pad1.assignKeyboard( );
        this.battle = new BattleModule( this.host );
        this.battle.oninstance = this.oninstance;
        this.battle.build( this.generateBuild( ) ).then(this.onbuild.bind(this));
    }

    sequence.generateBuild = function( ) {
        const builder = this.host.scenario_builder;
        builder.reset( ); //clear in case 
        builder.mode('sandbox').level('sandbox');
        builder.player1('garf', 'pad1', 0);
        builder.player2('garf', 'pad2', 1);
        return builder.stringify( );
    }

    sequence.onbuild = async function( json ) {
        console.log('match built successfully')
    }

    sequence.oninstance = function( instance ) {
        sequence.host.graphics.render( instance );
    }

    sequence.exit = function( ) {
        this.ui.close( );
    }

}