importScripts('./glmatrix-min.js', '../webworker/webworker_messenger.js');
// =============================================================================
// =                                  GLOBALS                                  = 
// =============================================================================
/** @type {OffscreenCanvas} */
let canvas;
/**@type {WebGLRenderingContext} */
let gl;
let active_progam = null;
const shaders = { };
const buffers = { };
const cache = { };
const mat4 = glMatrix.mat4;
const transform_matrix = new Float32Array(16);
const projection_matrix = new Float32Array(16);
const crop_matrix = new Float32Array(16);
/**@type {RenderInstructions} */
let instructor;
// =============================================================================
// =                               INITALIZATION                               = 
// =============================================================================
messenger.setRoute('init', async function(message) {
    canvas = message.canvas;
    gl = canvas.getContext('webgl', {preMultipledAlpha: false});
    createBuffer('square', [0, 0, 1, 0, 0, 1, 1, 1]);
    const shader_configs = await getJSON(message.uri);
    await precompile(shader_configs, message.uri);
    compilePrograms(shader_configs).then(( ) => messenger.send('init', true))
    .catch(err => messenger.send('init', err));
    instructor = new RenderInstructions( );
});
// =============================================================================
// =                               COMPLIE SHADER                              = 
// =============================================================================
async function precompile(config, uri) {
    for(const program_name in config) {
        const detail = config[program_name];
       detail.vertex = await getText(detail.vertex, uri);
       detail.fragment = await getText(detail.fragment, uri);
    }
}

function compilePrograms(config) {
    return new Promise((resolve, reject) => {
        try {
            syslog('compile-shader', 'starting compile');
            for(const name in config) {
                syslog('compile-shader', `shader[${name}]`);
                shaders[name] = createProgram(config[name]);
            }
            resolve( );
        } catch (err) {
            reject(err);
        }
    });
}

function createProgram(config) {
    const vertex_shader   = createShader(config.vertex, gl.VERTEX_SHADER);
    const fragment_shader = createShader(config.fragment, gl.FRAGMENT_SHADER);
    const program = linkProgram(vertex_shader, fragment_shader);
    const attributes = findAttributes(program, config);
    const uniforms = findUniforms(program, config);
    return {program: program, attributes: attributes, uniforms: uniforms}
}

function createShader(shader_text, shader_type) {
    const shader = gl.createShader(shader_type);
    gl.shaderSource(shader, shader_text);
    gl.compileShader(shader);
    if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    syslog('compile-error', 'shader', gl.getShaderInfoLog(shader), shader_text);
    gl.deleteShader(shader);
    throw 'Shader Compile Failure';
}

function linkProgram(vertex, fragment) {
    const program = gl.createProgram( );
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program, gl.LINK_STATUS);
    if(gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
    syserror('compile-error', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    throw 'Shader Compile Failure';
}

function findAttributes(program, config) {
    const attributes = { };
    const keys = getVariable('attribute', config);
    for(const key of keys) attributes[key] = gl.getAttribLocation(program, key);
    return attributes;
}

function findUniforms(program, config) {
    const uniforms = { };
    const keys = getVariable('uniform', config);
    for(const key of keys) uniforms[key] = gl.getUniformLocation(program, key);
    return uniforms;
}

function getVariable(key, config) {
    const names = [findParameter(config.vertex, key), findParameter(config.fragment, key)].flat( );
    return [...new Set(names)];
}

function findParameter(text, parameter) {
    const regex = new RegExp(`(?<=${parameter} ).*`, 'g');
    const results = text.match(regex);
    const params  = results ? results.map( x => x.substring(x.lastIndexOf(' ') + 1, x.length - 1)) : [];
    return params;
}

// =============================================================================
// =                          WEBGL DRAW UTILITIES                             = 
// =============================================================================
function setAttribute(program, name, length, stride, offset) {
    gl.enableVertexAttribArray(name);
    gl.vertexAttribPointer(program.attributes[name], length, gl.FLOAT, false, stride * 4, offset * 4)
}

function setAttributes(program, attributes) {
    for(const key in attributes) {
        const config = attributes[key];
        setAttribute(program, key, config.length, config.stride, config.offset);
    }
}

function setUniform(program, name, method, params) {
    gl[method](program.uniforms[name], ...params)
}

function setUniforms(program, uniforms) {
    for(const key in uniforms) {
        config = uniforms[key];
        setUniform(program, key, config.method, config.params);
    }
}

function setTexture(program, texture_data, index) {
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, texture_data.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[texture_data.wrap_s]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[texture_data.wrap_t]);
    console.log(texture_data)
    gl.uniform1i(program.uniforms['u_texture_' + index], index);
}

function createBuffer(name, data) {
    buffers[name] = gl.createBuffer() 
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[name]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
}

function useProgam(program) {
    if(active_progam == program.program) return program;
    else if (!program instanceof WebGLProgram) throw 'Error - cannot use invalid WebGLProgram';
    gl.useProgram(program.program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    active_progam = program.program;
    return program;
}

function getTextureData(name, crop = null, wrap_s = 'CLAMP_TO_EDGE', wrap_t = 'CLAMP_TO_EDGE') {
    const src = cache[name];
    if(crop instanceof Array) src.cropMatrix(crop_matrix, ...crop);
    else crop = mat4.identity(crop_matrix);
    console.log(crop_matrix);
    return { texture: src.texture, crop: crop_matrix, wrap_s: wrap_s, wrap_t: wrap_t, src: src}
}

// =============================================================================
// =                             RENDERING INSTRUCTOR                          = 
// =============================================================================
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

    setProgram(program, buffer = 'square') {
        this.instructions.program = program;
        this.instructions.buffer = buffer;
    }

}
// =============================================================================
// =                              RENDERING_METHOD(S)                          = 
// =============================================================================
function render(instance) {
    const projection = mat4.ortho(projection_matrix, ...instance.camera, 1, -1);
    renderDefaultStageBackground(projection);
}

function renderDefaultStageBackground(projection) {
    const program = useProgam(shaders['single_texture']);
    const texture_data = getTextureData('stage_pattern');
    setTexture(program, texture_data, 0);
    setAttribute(program, 'a_position', 2, 0, 0);
    setUniform(program, 'u_projection', 'uniformMatrix4fv', [false, projection_matrix]);
    setUniform(program, 'u_transform', 'uniformMatrix4fv', [false, mat4.fromScaling(transform_matrix, [texture_data.src.width, texture_data.src.height, 1])]);
    console.log(texture_data)
    setUniform(program, 'u_tint', 'uniform4f', [1, 1, 1, 1]);
    //setUniform(program, 'u_crop', 'uniformMatrix4fv', [false, crop_matrix]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function createRenderInstructions(object) {

}

const renderMethods = {}

renderMethods['single_texture'] = function(detail) {
    const texture_data = getTextureData(detail.textures[0], detail.uniforms);
    const program = useProgam(shaders['single_texture']);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.square);
    setAttributes(detail.attributes);
    setUniforms(detail.uniforms);
    setUniforms(program, {u_crop: {method: 'uniformMatrix4fv', params: [false, texture_data.cropping]}})
    setTexture(program, texture_data, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function fillColor(r, g, b, a) {
    gl.clearColor(r, g, b, a);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
}
// =============================================================================
// =                               TEXTURE_OBJECT                              = 
// =============================================================================
class TextureObject {

    #src;
    #texture;

    constructor(bitmap) {
        this.#src = bitmap;
        this.#texture = gl.createTexture( );
        this.#setTexture(bitmap);
    }

    get width( ) {return this.#src.width}

    get height( ) {return this.#src.height}

    get texture( ){
        return this.#texture;
    }

    #setTexture(bitmap) {
        gl.bindTexture(gl.TEXTURE_2D, this.#texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
        if(powerOf2(bitmap.width, bitmap.height)) return gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    //public 
    cropMatrix(matrix, x = 0, y = 0, width = this.#src.width, height = this.#src.height) {
        mat4.fromTranslation(crop_matrix, [x, y, 0]);
        return mat4.scale(matrix, matrix, [width / this.width, height / this.height, 1]);
    }

}
// =============================================================================
// =                                  UTILITY                                  = 
// =============================================================================
function getJSON(uri) {
    const url = new URL('../shader/config.json', uri);
    return fetch(url).then(res => res.json( ))
}

function getText(base_uri, uri) {
    const url = new URL(base_uri, uri);
    return fetch(url).then(res => res.text( ))
}

function powerOf2(n) {
    return (n & (n - 1) == 0);
} 

function syslog(group, ...messages) {
    messenger.send('syslog', {group: group, content: messages});
}

function syserror(group, ...messages) {
    messenger.send('syserror', {group: group, content: messages})
}
// =============================================================================
// =                                  ROUTES                                   = 
// =============================================================================
messenger.setRoute('bitmaps', function(bitmaps) {
    for(const name in bitmaps) cache[name] = new TextureObject(bitmaps[name])
    messenger.send('bitmaps');
})

messenger.setRoute('instance', function(instance) {
    render(instance);
})

messenger.setRoute('color-fill', function(color){
    fillColor(...color);
})