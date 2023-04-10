{
    class RenderEngine {

    #cache = { };
    #projection = new Float32Array(16);
    #transform  = new Float32Array(16);
    #instructor = new RenderInstructions( );

    constructor( ) {

    }

    #baseInstructions(object) { 
        this.#instructor.clear( );
        this.#generateTransformMatrix(object);
        this.#instructor.buffer = object.buffer_name || 'square';
        this.#instructor.setAttribute('a_position', 2, 2, 0);
        this.#instructor.setUniformMatrix('u_projection', this.#projection);
        this.#instructor.setUniformMatrix('u_transform', this.#transform);
    }


    #generateTransformMatrix(object) {
        glMatrix.mat4.fromTranslation(this.#transform, object.position);
        glMatrix.mat4.rotateX(this.#transform, this.#transform, object.rotation[0]);
        glMatrix.mat4.rotateY(this.#transform, this.#transform, object.rotation[1]);
        glMatrix.mat4.rotateZ(this.#transform, this.#transform, object.rotation[2]);
        glMatrix.mat4.translate(this.#transform, this.#transform, [-object.width * 0.5, -object.height * 0.5, 1]);
        glMatrix.mat4.scale(this.#transform, this.#transform, [object.width, object.height, 1]);
    }

    #renderTexture(object) {
        if(object.palette) this.#renderTexturePalette(object);
        else this.#renderSingleTexture(object);
    }

    #renderObject(object) {
        this.#baseInstructions(object);
        this.#renderColor(object);
    }

    //=======================================================

    #renderTexturePalette(object) {
        this.instructions.setTexture('u_texture0', this.#cache[object.texture.name].src, object.texture.wrap_s, object.texture.wrap_t);
        this.instructions.setTexture('u_texture1', this.#cache.palette.src);
    }

    #renderSingleTexture(object) {
        this.instructions.setTexture('u_texture0', this.#cache[object.texture.name].src, object.texture.wrap_s, object.texture.wrap_t);
    }

    #renderColor(object) {
        this.#instructor.program = 'color',
        this.#instructor.setUniform('u_tint', 'uniform4f', object.tint);
    }

    //=======================================================

    cacheTexture(key, bitmap) {
        this.#cache[key] = gl_engine.createTexture(bitmap);
    }

    setProjection(rect) {
        glMatrix.mat4.ortho(this.#projection, rect.left, rect.right, rect.bottom, rect.top, 1, -1);
    }

    render(objects, graphics_engine) {
        for(const object of objects) {
            this.#renderObject(object, graphics_engine);
            graphics_engine.draw(this.#instructor.instructions);
        }
    }

}

    class RenderInstructions {

        constructor( ) {
            this.clear( );
        }

        clear( ) {
            this.instructions = {
                buffer: 'square', program: 'color',
                attributes: { }, uniforms: { },  textures: [ ], draw_method: 'TRIANGLE_STRIP', first_array: 0, indices: 4
            };
        }

        setAttribute(name, length, stride, offset) {
            this.instructions.attributes[name] = {length: length, stride: stride, offset: offset}
        }

        setUniform(name, method, params) {
            this.instructions.uniforms[name] = {method: method, params: params}
        }

        setUniformMatrix(name, matrix) {
            this.setUniform(name, 'uniformMatrix4fv', [false, matrix]);
        }

        setTexture(name, texture, wrap_s = "CLAMP_TO_EDGE", wrap_t = "CLAMP_TO_EDGE") {
            this.instructions.textures.push({name: name, src:texture, wrap_s: wrap_s, wrap_t: wrap_t});
        }

        setDraw(method, first, indices) {
            this.instructions.draw_method = method;
            this.instructions.first_array = first;
            this.instructions.indices = indices
        }

    }

    self.RenderEngine = RenderEngine;
}
