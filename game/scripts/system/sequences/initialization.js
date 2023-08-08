import Sequence from "../classes/sequence.js";
import glMain from "../../webgl/gl_main.js";

const Initialization = new Sequence('initialization');

Initialization.onEnter = async function( ) {
    const graphics = await initializeGraphics( );
    this.sequencer.transition('main');
}

const initializeGraphics = async function( ) {
    const graphics = new glMain( );
    await graphics.init( );
    return graphics;
}

Initialization.onExit = function( ) { }

export default Initialization;