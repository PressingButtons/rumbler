{
    class glEngine {

        /** @type {WebGLRenderingContext} */
        #gl;
        #programs = { };
        #buffers = { };
        #current_program;

        constructor(canvas, options = {premultipliedAlpha: false}) {
            this.#gl = canvas.getContext('webgl', options);
        }

        get gl( ) {return this.#gl}


        #draw_setAttributes(attributes) {
            for(const attribute in attributes) {
                const detail = attributes[attribute];
                const value = this.#current_program.attributes[attribute];
                this.#gl.enableVertexAttribArray(attribute);
                this.#gl.vertexAttribPointer(value, detail.length, this.#gl.FLOAT, false, detail.stride * 4, detail.offset * 4);
            }
        }

        #draw_setUniforms(uniforms) {
            for(const uniform in uniforms) {
                const detail = uniforms[uniform];
                const value = this.#current_program.uniforms[uniform];
                this.#gl[detail.method](value, ...detail.params);
            }
        }

        #draw_setTexture(texture, i) {
            this.#gl.activeTexture(this.#gl.TEXTURE0 + i);
            this.#gl.bindTexture(this.#gl.TEXTURE_2D, texture.src);
            this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_S, texture.wrap_s);
            this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_T, texture.wrap_t);
            this.#gl.uniform1i(this.#current_program.uniforms[texture.uniform], i);
        }

        #draw_useProgram(name) {
            if(this.#current_program == this.#programs[name]) return;
            this.#current_program = this.#programs[name];
            this.#gl.useProgram(this.#current_program.program);
            this.#gl.enable(this.#gl.BLEND);
            this.#gl.blendFunc(this.#gl.SRC_ALPHA, this.#gl.ONE_MINUS_SRC_ALPHA);
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

        compile(program_key, vertex_text, fragment_text) {
            const program = compileProgram(this.#gl, vertex_text, fragment_text);
            this.#programs[program_key] = program;
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

        defineBuffer(name, value) {
            this.#buffers[name] = this.#gl.createBuffer();
            this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#buffers[name]);
            this.#gl.bufferData(this.#gl.ARRAY_BUFFER, new Float32Array(value), this.#gl.STATIC_DRAW);
        }

        draw(instructions) {
            this.#draw_useProgram(instructions.program);
            this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#buffers[instructions.buffer]);
            this.#draw_setAttributes(instructions.attributes);
            this.#draw_setUniforms(instructions.uniforms);
            for(let i = 0; i < instructions.textures.length; i++) this.#draw_setTexture(instructions.textures[i], i);
            this.#gl.drawArrays(this.#gl[instructions.draw_method], instructions.first_array, instructions.indices);
        }

        
        fill(color) {
            this.#gl.clearColor(...color);
            this.#gl.clear(this.#gl.DEPTH_BUFFER_BIT | this.#gl.COLOR_BUFFER_BIT);
        }

    }

    /**=======================================================================
     * compileProgram
     * =======================================================================
     * Compiles a shader program
     * @param {WebGLRenderingContext}
     * @param {String} vertex_text 
     * @param {String} fragment_text 
     * @returns {WebGLProgram}
     */

    const compileProgram = function(gl, vertex_text, fragment_text) {
        try {
            const program = createLinkedProgram(gl, vertex_text, fragment_text);
            const attributes = findAttributes(gl, program, vertex_text, fragment_text);
            const uniforms = findUniforms(gl, program, vertex_text, fragment_text);
            return {
                program: program,
                attributes: attributes,
                uniforms: uniforms
            }
        } catch(err) { throw err; }
    }
    
    const createLinkedProgram = (gl, vertex_text, fragment_text) => {
        try {
            const vertex_shader =  defineShader(gl, vertex_text, gl.VERTEX_SHADER);
            const fragment_shader = defineShader(gl, fragment_text, gl.FRAGMENT_SHADER);  
            return defineProgram(gl, vertex_shader, fragment_shader);
        } catch (err) {
            throw err;
        }
    }
    
    const defineShader = (gl, shader_text, shader_type) => {
        const shader = gl.createShader(shader_type);
        gl.shaderSource(shader, shader_text);
        gl.compileShader(shader);
        const success = validateShader(gl, shader, shader_text);
        if(success) return shader;
        else throw 'failed to compile \n' + shader_text;
    }
    
    const validateShader = (gl, shader, text) => {
        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return true;
        console.error(text);
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw 'Error compiling shader!';
    }
    
    const defineProgram = (gl, vertex_shader, fragment_shader) => {
        const program = gl.createProgram( );
        gl.attachShader(program, vertex_shader);
        gl.attachShader(program, fragment_shader);
        gl.linkProgram(program, gl.LINK_STATUS);
        const status = valideProgramLink(gl, program);
        if(status) return program;
        else throw status 
    }
    
    const valideProgramLink = (gl, program) => {
        if(gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
        const err = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw err;
    }
    
    const findAttributes = (gl, program, vertex_text, fragment_text) => {
        const keys = getVariableKeys(vertex_text, fragment_text, 'attribute');
        const attributes = { };
        for(const key of keys) attributes[key] = gl.getAttribLocation(program, key);
        return attributes;
    }
    
    const findUniforms = (gl, program, vertex_text, fragment_text) => {
        const keys = getVariableKeys(vertex_text, fragment_text, 'uniform');
        const uniforms = { };
        for(const key of keys) uniforms[key] = gl.getUniformLocation(program, key);
        return uniforms;
    }
    
    const getVariableKeys = (vertex_text, fragment_text, variable_type) => {
        const vertex_attributes = findParameter(vertex_text, variable_type);
        const fragment_attributes = findParameter(fragment_text, variable_type);
        const keys = [].concat(vertex_attributes, fragment_attributes);
        return [...new Set(keys).values( )];
    }
    
    const findParameter = (text, parameter) => {
        const regex = new RegExp(`(?<=${parameter} ).*`, 'g');
        const results = text.match(regex);
        const params  = results ? results.map( x => x.substring(x.lastIndexOf(' ') + 1, x.length - 1)) : [];
        return params;
    }

    self.glEngine = glEngine;
}


