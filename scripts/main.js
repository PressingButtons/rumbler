import initGraphics from "./graphics/graphics.js"

window.onload = async function(event) {
    const base_uri = new URL('../', import.meta.url).href;
    await initGraphics(base_uri);
    
    console.log('graphics initialized');
}