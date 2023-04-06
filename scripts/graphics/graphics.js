import Graphics from "./webgl_graphics_worker/graphics_worker.js";

export default async function initGraphics(base_uri) {
    await Graphics.init(document.getElementById('game'), base_uri, 'shader/config.json');
    Graphics.fill([1,0,0,1]);
    
}