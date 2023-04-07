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

    //Single Action Methods 
    fill(color) {
        this.send('color-fill', color);  
    }


}