import Graphics from "../graphics/graphics.js";
import GameWorker from "../game/game-worker.js";
import preload from "./preload.js";
import Operator from "./singletons/operator.js";
import InputManager from "./singletons/inputmanager.js";

let graphics, gamesystem;

async function setupGraphics(bitmaps) {
    graphics = new Graphics( );
    await graphics.initialize( document.getElementById('game')).catch(err => console.error(err));
    await graphics.sendTextures(bitmaps);
}

export async function init( ) {
    const cache = await preload( );
    await setupGraphics(cache.bitmaps);
    gamesystem = new GameWorker( );
    Operator.add( 'input', InputManager.update.bind(InputManager) )
    test2( );
}

function test( ) {
    const identity = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])

    graphics.render({
        camera: {left: 0, right: 800, bottom: 400, top: 0},
        entries: [{shader_type: 'single_texture',
        textures: ['stage_pattern'],
        position: [400, 232, 0],
        velocity: [0, 0, 0],
        rotation: [0, 0, 0],
        width: 800, height: 464,
        tint:     [1, 1, 1, 1]}],
    })
}

function test2( ) {

    InputManager.setScheme('p1', 'keyboard', {
        menu: 'enter',
        left: 'a', right: 'd', up: 'w', down: 's',
        A: 'y', B: 'u', C: 'h', D: 'j', confirm: 'enter', cancel: 'backspace' 
    })

    gamesystem.createGame( );
    gamesystem.setRoute('state', message => {
        graphics.render(message);
    })

    Operator.add('test', function( ) {
        gamesystem.sendInput({ p1: InputManager.p1, p2: InputManager.p2 });
    })

}