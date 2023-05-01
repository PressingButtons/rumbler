import sys_utils from "./sys_utils.js";
import sys_input_init from "./sys_input-event.js";
import sys_render from "../render/render_worker-module.js";
import sys_game   from "../game/gameworker_module.js"
import SignalObject from "./signal_object.js";

export default async function sys_init( ) {
    const database = await loadDatabase( );
    sys_input_init( );
    setReportRoutes( );
    await initRenderer(document.getElementById('game'));
    console.log('[System]', 'initialized');
    const system = new SignalObject( );
    system.utils = sys_utils;
    system.renderer = sys_render;
    system.game = sys_game;
    return system;
}

function loadDatabase( ) {
    return sys_utils.fetchJSON('./data/db.json');
}

async function initRenderer(canvas) {
    const bitmaps = await preloadBitmaps( );
    console.log(bitmaps);
    await sys_render.init(sys_utils.base_uri.href, canvas, bitmaps);
}

async function preloadBitmaps(bitmaps = { }) {
    const config = await sys_utils.fetchJSON('./data/textures.json');
    for(let key in config) bitmaps[key] = await createBitmap(config[key]);
    return bitmaps;
}

function createBitmap(url) {
    return sys_utils.loadImage('./images/' + url).then(createImageBitmap);
}

function setReportRoutes( ) {
    sys_game.setRoute('syslog', message => {
        console.log('[Game]', message.group, ...message.content);
    });
    sys_game.setRoute('syserror', message => {
        console.error('[Game]', message.group, ...message.content);
    });
    sys_render.setRoute('syslog', message => {
        console.log('[Render]', message.group, ...message.content);
    });
    sys_render.setRoute('syserror', message => {
        console.error('[Render]', message.group, ...message.content);
    });
}