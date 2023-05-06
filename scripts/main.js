import scene_manager from "../scene_manager.js";
import input_manager from "./system/input_manager.js";
import sys_init from "./system/sys_init.js"

window.onload = async function(event) {
    const system = await sys_init( );
    scene_manager(system);
    input_manager.setHook('input', function(options) {
        system.game.sendInput(input_manager.serialize( ));
    });

    system.signal('scene:game');
    const camera = {x: 0, y: 0, width: 576, height: 333}

    await system.game.createGame({
        frames_per_second: 60, 
        players: [
            {operator: 'human', controller: 'keyboard', level: 0, rumbler: 'dummy'},
            {operator: 'computer', controller: 'computer', level: 0, rumbler: 'dummy'},
        ]
    });

    system.game.setRoute('game-instance', instance => {

        system.renderer.render(instance)

    });

    console.log('starting game');

    system.game.play( );

}
