import RenderWorkerES6 from "./render/render_worker-module.js";
import GameWorkerES6 from "./game/gameworker_module.js";

window.onload = async function(event) {
    const uri = new URL('./', import.meta.url);
    const game_worker = new GameWorkerES6( );
    const render_worker = new RenderWorkerES6(uri.href);
    const result = await render_worker.init(document.getElementById('game'), game_worker).then(x => render_worker.preloadTextures());

    let pos = [0, 0];

    
    function test(x, y) {
        render_worker.render({
            projection: {left: 0, right: 800, top: 0, bottom: 450},
            objects: [{
                position: [x, y, 0],
                rotation: [0, 0, 0],
                width: 50, height: 50,
                tint: [1, 1, 1, 1]
            }] 
        })
    }

    document.addEventListener('keydown', event => {
        if(event.key == 'd') pos[0] ++;
        if(event.key == 'a') pos[0] --;
        if(event.key == 'w') pos[1] --;
        if(event.key == 's') pos[1] ++;
        render_worker.fill(new Array(4).fill(0).map(x => Math.random( )));
        test(...pos);
    });



}