import Sequencer from "../system/classes/sequencer.js";
import initializeSequence from "./sequences/init.js";
import seqSandbox from "./sequences/sandbox/sandbox.js";
// =============================================
//  Creating the Game System
// =============================================
const sysmain = new Sequencer( );
// =============================================
//  Modules 
// =============================================

// =============================================
//  create initialization sequence
// =============================================
initializeSequence( sysmain.createSequence('init') )

window.onload = async function( event ) {
    await sysmain.goToSequence('init');
    testing( );
}

const testing = ( ) => {
    seqSandbox( sysmain.createSequence('sandbox'));
    sysmain.goToSequence('sandbox');
}