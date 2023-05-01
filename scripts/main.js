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

    const objects =  [{position: [120, 160, 0], rotation: [0, 0, 0], width: 50, height: 80, display: {shader: 'single_texture', texture: null, rect: [0, 0, 50, 80]}}];

    camera.projection = function( ) {
        return [this.x, this.x + this.width, this.y + this.height, this.y]
    }

    system.renderer.render({camera: camera.projection( ), objects: objects});

    document.addEventListener('inputevent', event => {
        if(event.detail.value == 0) return;
        switch(event.detail.key.toLowerCase( )) {
            case 'a': camera.x -= 5; break;
            case 'w': camera.y -= 5; break;
            case 'd': camera.x += 5; break;
            case 's': camera.y += 5; break;
            case 'arrowup'   : objects[0].position[1] -= 5; break;
            case 'arrowleft' : objects[0].position[0] -= 5; break;
            case 'arrowdown' : objects[0].position[1] += 5; break;
            case 'arrowright': objects[0].position[0] += 5; break;
            case 'm': objects[0].rotation[2] -= 5 * Math.PI / 180; break;
            case '.': objects[0].rotation[2] += 5 * Math.PI / 180; break;
        }
        system.renderer.render({camera: camera.projection( ), objects: objects});
    });
}
