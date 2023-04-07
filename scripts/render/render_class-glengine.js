class glEngine {

    /** @type {WebGLRenderingContext} */
    #gl;
    #programs = { };

    constructor(canvas, options = {premultipliedAlpha: false}) {
        this.#gl = canvas.getContext('webgl', options);
    }

    get gl( ) {return this.#gl}

    #compile_defineShader(shader_text, shader_type) {
        const shader = this.#gl.createShader(shader_type);
        this.#gl.shaderSource(shader, shader_text);
        this.#gl.compileShader(shader);
        if(this.#gl.getShaderParameter(shader, this.#gl.COMPILE_STATUS)) return shader;
        else {
            console.error('Failed to compile shader\n=====================\n', shader_text);
            throw 'Render: Shader-Compile-Errror';
        }
    }

    #compile_defineProgram(vertex_shader, fragment_shader) {
        const program = this.#gl.createProgram( );
        this.#gl.attachShader(program, vertex_shader);
        this.#gl.attachShader(program, fragment_shader);
        this.#gl.linkProgram(program, this.#gl.LINK_STATUS);
        if(this.#gl.getProgramParameter(program,this.#gl.LINK_STATUS)) return program;
        const error = this.#gl.getProgramInfoLog(program);
        this.#gl.deleteProgram(program);
        console.error('Render: Shader-Compile-Error');
        throw error;
    }

    #compile_findParameter(parameter, vertex_text, fragment_text) {
        const regex = new RegExp(`(?<=${parameter} ).*`, 'g');
        const v_matches = vertex_text.match(regex);
        const f_matches = fragment_text.match(regex);
        const parameter_set = new Set([].concat(v_matches, f_matches))
        return [...parameter_set.values( )];  
    }

    #compile_gatherAttributes(program, vertex_text, fragment_text) {
        const attributes = { };
        const attribute_keys = this.#compile_findParameter('attribute', vertex_text, fragment_text);
        for(const key of attribute_keys) attributes[key] = this.#gl.getAttribLocation(program, key);
        return attributes;
    }

    #compile_gatherUniforms(program, vertex_text, fragment_text) {
        const uniforms = { };
        const uniform_keys = this.#compile_findParameter('uniform', vertex_text, fragment_text);
        for(const key of uniform_keys) uniforms[key] = this.#gl.getUniformLocation(program, key);
        return uniforms;
    }

    #texture_powerOf2(n) {
        return (n & (n - 1) == 0)
    }

    #texture_setTextureParameters( ) {
        const gl = this.#gl;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    #fetchText(url, base) {
        return fetch(new URL(url, base)).then(res => res.text( ));
    }

    async compile(program_key, vertex_text, fragment_text) {
        const vertex_shader   = this.#compile_defineShader(vertex_text, this.#gl.VERTEX_SHADER);
        const fragment_shader = this.#compile_defineShader(fragment_text, this.#gl.FRAGMENT_SHADER);
        const shader_program  = this.#compile_defineProgram(vertex_shader, fragment_shader);
        const attributes      = this.#compile_gatherAttributes(shader_program, vertex_text, fragment_text);
        const uniforms        = this.#compile_gatherUniforms(shader_program, vertex_text, fragment_text);
        this.#programs[program_key] = {
            program: shader_program,
            attributes: attributes,
            uniforms: uniforms
        }   
    }

    createTexture(image) {
        const texture = this.#gl.createTexture( );
        this.#gl.bindTexture(this.#gl.TEXTURE_2D, texture);
        this.#gl.texImage2D(this.#gl.TEXTURE_2D, 0, this.#gl.RGBA, this.gl.RGBA, this.#gl.UNSIGNED_BYTE, image);
        if(this.#texture_powerOf2(image.width) && this.#texture_powerOf2(image.height)) this.#gl.generateMipmap(this.#gl.TEXTURE_2D);
        else this.#texture_setTextureParameters( );
        return {
            texture: texture, width: image.width, height: image.height, inverse_height: 1 / image.height, inverse_width: 1 / image.width
        }
    }

    fill(color) {
        this.#gl.clearColor(...color);
        this.#gl.clear(this.#gl.DEPTH_BUFFER_BIT | this.#gl.COLOR_BUFFER_BIT);
    }

}