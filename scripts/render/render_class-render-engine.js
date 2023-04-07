class RenderEngine {

    #cache = { };
    #uri;

    constructor( ) {

    }

    cacheTexture(key, bitmap) {
        this.#cache[key] = gl_engine.createTexture(bitmap);
        console.log(this.#cache[key])
    }

}