import RenderWorkerES6 from "./render/render_worker-module.js";
import GameWorkerES6 from "./game/gameworker_module.js";

window.onload = async function(event) {
    const uri = new URL('./', import.meta.url);
    const game_worker = new GameWorkerES6( );
    const render_worker = new RenderWorkerES6(uri.href);
    const result = await render_worker.init(document.getElementById('game'), game_worker).then(x => render_worker.preloadTextures());

    document.addEventListener('keyup', event => {
        render_worker.fill(new Array(4).fill(0).map(x => Math.random( )));
    })
}