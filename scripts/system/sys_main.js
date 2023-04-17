import preload from './preloader.js';
import RenderWorkerES6 from "../render/render_worker-module.js";
import GameWorkerES6 from "../game/gameworker_module.js";
import sys_utils from './sys_utils.js';
import sys_input_init from './sys_input.js';
import input_manager from './input_manager.js';
import './sys_out.js';


const game_worker = new GameWorkerES6( );
const render_worker = new RenderWorkerES6( );

render_worker.setRoute('syslog', message => {
    sysout.log(message.group, ...message.content);
});

render_worker.setRoute('syserror', message => {
    sysout.log(message.group, ...message.content);
})

game_worker.setRoute('syslog', message => {
    sysout.log(message.group, ...message.content);
});

game_worker.setRoute('syserror', message => {
    sysout.log(message.group, ...message.content);
})


const sysmain = {
    utils: sys_utils
}

const handle_game_input = (event) => {
    const serialization = input_manager.update(event.detail);
    game_worker.send('input', serialization);
}

sysmain.init = async function( ) {
    const config = await preload(sys_utils);
    await render_worker.init(sys_utils.base_uri.href, document.getElementById('game'), game_worker, config.bitmaps.textures);
    sys_input_init( );
    document.addEventListener('inputevent', handle_game_input);
    sysout.log('system', 'initialization complete');
}

sysmain.renderer = render_worker;
sysmain.game_system = game_worker;

// =============== creating the worker environments =================


export default sysmain;