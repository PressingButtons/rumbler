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

    fill(color) {
        this.#gl.clearColor(...color);
        this.#gl.clear(this.#gl.DEPTH_BUFFER_BIT | this.#gl.COLOR_BUFFER_BIT);
    }

}