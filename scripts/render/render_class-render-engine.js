class RenderEngine {

    #cache = { };
    #uri;

    constructor(uri) {
        this.#uri = uri;
    }

    #crea

    #loadImage(url) {
        return fetch(new URL(url, this.#uri)).then(res => res.blob( ));
    }

    async loadTexture(key, url) {
        const image = await this.#loadImage(url);
        console.log(image);
        this.#cache[key] = gl_engine.createTexture(image);
    }

    async loadTextures(config) {
        const promises = [];
        for(const key in config) promises.push(this.loadTexture(key, config[key]));
        return Promise.all(promises);
    }

}