
import WrappedWorker from "../../../../utils/classes/wrapped_worker.js";
import Sequence from "../../sequence.js";

const sequence = new Sequence('battle');

let battle;

sequence.enter = async function( config ) {
    // Close battle if running ======================================
    if( battle ) await battle.sendMessage('close');
    // Create new Battle Worker =====================================
    battle = new WrappedWorker(new URL('./wrk.battle.js', import.meta.url));
    // Setting Routes //=============================================
    battle.setRoute('instance', message => {
        this.system.graphics.render( message );
    });
    // creating battle scenario =====================================
    await battle.sendMessage('create', {
        stage: this.system.database.stages[ config.stage ]
    });
}

sequence.exit = async function( modules ) {
    if( battle ) await battle.sendMessage('close');
}


export { sequence };