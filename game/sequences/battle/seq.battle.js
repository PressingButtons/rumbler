
import WrappedWorker from "../../../utils/classes/wrapped_worker.js";
import Sequence from "../../../system/classes/sequence.js";

const sequence = new Sequence('battle');

let battle;

const input_listener = event => {
    battle.sendMessage('input_event', { type: event.type, detail: event.detail });
}

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
        stage: this.system.database.stages[ config.stage ],
        p1: { control_settings: config.p1.control_settings, actor: this.system.database.gameobjects.rumblers[ config.p1.type ]},
        p2: { control_settings: config.p2.control_settings, actor: this.system.database.gameobjects.rumblers[ config.p2.type ]}
    });

    // Creating input listener =======================================
    document.addEventListener('input_pressed', input_listener);
    document.addEventListener('input_released', input_listener);
    //running scenario
    await battle.sendMessage('run');
}

sequence.exit = async function( modules ) {
    if( battle ) await battle.sendMessage('close');
    document.removeEventListener('input_pressed', input_listener);
    document.removeEventListener('input_released', input_listener);
}


export { sequence };