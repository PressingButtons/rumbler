import preload from './preloader.js';
import RenderWorkerES6 from "../render/render_worker-module.js";
import GameWorkerES6 from "../game/gameworker_module.js";
import sys_utils from './sys_utils.js';
import sys_input_init from './sys_input.js';
import VirtualController from './virtual_controller.js';


const game_worker = new GameWorkerES6( );
const render_worker = new RenderWorkerES6( );

const controllers = {
    p1: {id: null, controller: new VirtualController( )},
    p2: {id: null, controller: new VirtualController( )}
}

const sysmain = {
    utils: sys_utils
}

const onInputEvent = event => {
    for(const name in controllers) {
        const controller = controllers[name];
        if(controller.id == event.detail.type) controller.controller.set(event.detail);
        game_worker.send(controller.controller.serialize( ));
    }
}

sysmain.init = async function( ) {
    const config = await preload(sys_utils);
    //const g_success = await game_worker.init(config.bitmaps.maps);
    const r_success = await render_worker.init(sys_utils.base_uri.href, document.getElementById('game'), game_worker, config.bitmaps.textures);
    sys_input_init( );
    document.addEventListener('inputevent', onInputEvent);
    console.log('initialization:\n ', '\n  render-environment -',  r_success[0]);
}

sysmain.renderer = render_worker;
sysmain.game_system = game_worker;

// =============== creating the worker environments =================


export default sysmain;