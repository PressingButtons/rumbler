import GameWorkerES6 from "../game/gameworker_module.js";
import WrappedWebWorkerES6 from "../webworker/webworker_wrapped_es6.js";

export default class RenderWorkerES6 extends WrappedWebWorkerES6 {

    #base_uri

    constructor(uri) {
        super(new URL('render_script-main.js', import.meta.url));
        this.#base_uri = uri;
    }

    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    #initEngine(canvas) {
        const offscreen = canvas.transferControlToOffscreen( );
        return this.sendAsync('init', { canvas: offscreen, uri: this.#base_uri }, [offscreen]); //compile graphics setup
    }

    #loadBitmap(url) {
        return new Promise((resolve, reject) => {
            const image = new Image( );
            image.onload = event => { resolve(createImageBitmap(image)) };
            image.onerror = event => reject;
            image.src = url;
        });
    }
    
    /**
     * preloads all textures
     */
    async #preload( ) {
        const data = await fetch(new URL('../data/textures.json', this.#base_uri)).then(res => res.json( ));
        const images = [], message = { }
        for(const key in data.textures) {
            const bitmap = await this.#loadBitmap(new URL( data.directory_uri + data.textures[key], this.#base_uri))
            images.push(bitmap);
            message[key] = bitmap;
        }
        return this.sendAsync('preload', message, images);
    }

    /**
     * Sends a message received from worker to render engine
     * @param {Object} message 
     */

    #transferMessage(message) {
        this.send(message.type, message.content);
    }

    /**
     * 
     * @param {GameWorkerES6} game_worker 
     */
    #setRenderRoutes(game_worker) {
        game_worker.setRoute('game-instance', this.#transferMessage.bind(this));
    }

    /**
     * initialize render engine
     * @param {HTMLCanvasElement} canvas 
     * @param {GameWorkerES6} game_worker 
     */

    async init(canvas, game_worker) {
        this.#setRenderRoutes(game_worker);
        return this.#initEngine(canvas);
    }

    async preloadTextures( ) {
        return this.#preload( );
    }

    //Single Action Methods 
    fill(color) {
        this.send('color-fill', color);  
    }


}