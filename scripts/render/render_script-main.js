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
    const names = [ ];
    names.concat(findParameter(config.vertex, key), findParameter(config.fragment, key));
    return [...new Set(names).values( )];
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
function setAttributes(programm, attributes) {
    for(const key in attributes) {
        const config = attributes[key];
        const attribute = programm.attributes[key];
        gl.enableVertexAttribArray(key);
        gl.vertexAttribPointer(attribute, config.legnth, gl.FLOAT, flase, config.stride * 4, config.offset * 4);
    }
}

function setUniforms(program, uniforms) {
    for(const key in uniforms) {
        config = uniforms[key];
        const uniform = program.uniforms[key];
        gl[config.method](uniform, ...config.params);
    }
}

function setTexture(program, texture_data, index) {
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, texture_data.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, texture_data.wrap_s);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, texture_data.wrap_t);
    gl.uniform1i(program.unforms['u_texture_' + index]);
}

function createBuffer(name, data) {
    buffers[name] = gl.createBuffer() 
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[name]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
}

function useProgam(program) {
    if(active_progam == program) return program;
    else if (!program instanceof WebGLProgram) throw 'Error - cannot use invalid WebGLProgram';
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function getTextureData(detail) {
    const texture_data = cache[detail.texture];
    const crop = texture_data.cropMatrix(crop_matrix, detail.crop);
    return {texture: texture_data.texutre, cropping: crop, wrap_s: detail.wrap_s, wrap_t: detail.wrap_t};
}
// =============================================================================
// =                              RENDERING_METHOD(S)                          = 
// =============================================================================
function render(instance) {
    console.log(instance);
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

    get width( ) {return bitmap.width}

    get height( ) {return bitmap.height}

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
        mat4.fromTranslation([x, y, 0]);
        return mat4.scale(matrix, matrix, [width / this.width, height / this.height, 1]);
    }

}
// =============================================================================
// =                                  UTILITY                                  = 
// =============================================================================
function getJSON(uri) {
    const url = new URL('../shaders/config.json', uri);
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

messenger.setRoute('render', function(instance) {
    render(instance);
})