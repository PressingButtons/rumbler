import WrappedWebWorkerES6 from "../webworker/webworker_wrapped_es6.js";

class RenderWorkerES6 extends WrappedWebWorkerES6 {
    
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
    
    /**
     * initialize render engine
     * @param {HTMLCanvasElement} canvas 
     * @param {GameWorkerES6} game_worker 
     */

    async init(uri, canvas, bitmaps) {
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
        this.send('instance', object);
    }

}

export default new RenderWorkerES6( );
