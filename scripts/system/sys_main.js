import preload from './preloader.js';
import RenderWorkerES6 from "../render/render_worker-module.js";
import GameWorkerES6 from "../game/gameworker_module.js";
import sys_utils from './sys_utils.js';


const game_worker = new GameWorkerES6( );
const render_worker = new RenderWorkerES6( );

const sysmain = {
    utils: sys_utils
}

sysmain.init = async function( ) {
    const config = await preload(sys_utils);
    await game_worker.init(config.bitmaps.maps);
    const render_success = await render_worker.init(config.bitmaps.textures, document.getElementById('game'), game_worker, config.bitmaps);
    console.log(render_success);
}

sysmain.renderer = render_worker;
sysmain.game_system = game_worker;

// =============== creating the worker environments =================


export default sysmain;