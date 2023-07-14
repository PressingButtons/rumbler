import WorkerModule from "../system/objects/worker_module.js";

export default class Graphics extends WorkerModule {

    #gl;
    #worker;

    constructor( ) {
        super('/scripts/graphics/g_worker.js');
    }

    get gl( ) {
        return this.#gl
    }

    async #getShaderDefinitions( ) {
        const config = await fetch('/shader/config.json').then( res => res.json( ));
        for(const name in config) {
            for(const key in config[name])
                config[name][key] = await fetch(config[name][key]).then(res => res.text( ));
        } 
        return config;
    }

    #onfailure(message) {
        console.log('[System] - Graphics failed to initialized', message.err);
    }

    #onsuccess( message ) {
        console.log('[System] - Graphics successfully initialized');
    }

    /**
     * 
     * @param {HTMLCanvasElement} canvas 
     * @param {Object} shader_definitions 
     */
    async initialize( canvas ) {
        const offscreen = canvas.transferControlToOffscreen( );
        const shader_definitions = await this.#getShaderDefinitions( );
        this.sendMessageAsync('initialize', [offscreen, shader_definitions], [offscreen])
        .then(this.#onsuccess).catch(this.#onfailure);
    }

    render( detail ) {
        this.sendMessage('render', detail);
    }

    clear( color ) {
        this.sendMessage('fill', color);
    }

    sendTextures( textures ) {
        return Promise.all( textures.map( group => {
            this.sendMessageAsync('texture', group, [group.bitmap]);
        }))
    }

}