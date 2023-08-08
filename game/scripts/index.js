import Initialization from "./system/sequences/initialization.js";
import Sequencer from "./system/classes/sequencer.js";

window.onload = event => {

    const System = new Sequencer( );

    System.addSequence('init', Initialization);
    System.addSequence('mainmenu', MainMenu);

}