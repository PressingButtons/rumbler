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
    Operator.add( InputManager.update.bind(InputManager) )
    test2( );
}

function test( ) {
    const identity = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ])

    /*

    graphics.render({
        shader:     'single_texture',
        textures:   ["stage_pattern"],
        attributes: [{location: 'a_position', length: 2, stride: 0, offset: 0}],
        uniforms:   [{location: 'u_tint', method: 'uniform4fv', value: [1, 1, 1, 1]}],
        matrices:   [{location: 'u_transform', value: identity}, {location: 'u_projection', value: identity}]
    })

    */

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
    gamesystem.createGame( );
    gamesystem.setRoute('state', message => {
        graphics.render(message);
    })

    InputManager.setRoute('keydown', event => {
        console.log( [...InputManager.keyboard])
    })
}