import GameWorkerES6 from "../game/gameworker_module.js";
import WrappedWebWorkerES6 from "../webworker/webworker_wrapped_es6.js";

export default class RenderWorkerES6 extends WrappedWebWorkerES6 {
    
    constructor( ) {
        super(new URL('render_script-main.js', import.meta.url));
    }

    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     */
    #initEngine(canvas, uri) {
        const offscreen = canvas.transferControlToOffscreen( );
        return this.sendAsync('init', { canvas: offscreen, uri: uri}, [offscreen]); //compile graphics setup
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

    async init(uri, canvas, game_worker, bitmaps) {
        this.#setRenderRoutes(game_worker);
        const success = await this.#initEngine(canvas, uri);
        if(success) await this.createTextures(bitmaps);
        return success;
    }

    async createTextures(bitmaps) {
        const ar = Object.values(bitmaps);
        return this.sendAsync('bitmaps', bitmaps, ar);
    }

    //Single Action Methods 
    fill(color) {
        this.send('color-fill', color);  
    }

    /**
     * Render 
     * ===========
     * @param {Object} object 
     * @returns void 
     * object must havea a projection_rect
     */
    render(object) {
        this.send('render', object);
    }


}