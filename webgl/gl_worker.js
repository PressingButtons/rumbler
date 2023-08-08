/** == -----------------------------------------
 *  Global Variables
 == -------------------------------------------*/
 const shaders  = { };
 const buffers  = { };
 const textures = { };
 const m0 = new Float32Array(16);
 const m1 = new Float32Array(16);
 const m2 = new Float32Array(16);
 const m00 = new Float32Array(16);
 let gl;
 let DEBUG = false;
 let shader = null;
/** == -----------------------------------------
 *  Importing Scripts
 == -------------------------------------------*/
 importScripts(
    '/utils/glmatrix-min.js',
    '/utils/boiler/worker_messenger.js'
);
const mat4 = glMatrix.mat4;
/** == -----------------------------------------
 * Compile
 == -------------------------------------------*/
 {
    self.compile = async ( gl, vertex, fragment ) => {
        return  createShaders( gl, vertex, fragment )
        .then( shaders => createProgram( gl, shaders ))
        .then( program => packageProgram( gl, program, vertex, fragment ));
    }

    // creating shaders

    const createShaders = ( gl, vertex, fragment ) => {
        return new Promise((resolve, reject) => {
            resolve({
                vertex: createShader( gl, vertex, gl.VERTEX_SHADER),
                fragment: createShader( gl, fragment, gl.FRAGMENT_SHADER)
            })
        });
    }

    const createShader = ( gl, text, type ) => {
        const shader = gl.createShader( type );
        gl.shaderSource( shader, text );
        gl.compileShader( shader );
        if( gl.getShaderParameter( shader, gl.COMPILE_STATUS)) return shader;
        const err = gl.getShaderInfoLog( shader );
        gl.deleteShader( shader );
        throw err;
    }

    // creating program

    const createProgram = ( gl, shaders ) => {
        const program = gl.createProgram( );
        gl.attachShader( program, shaders.vertex );
        gl.attachShader( program, shaders.fragment );
        gl.linkProgram ( program, gl.LINK_STATUS );
        if( gl.getProgramParameter(program, gl.LINK_STATUS )) return program;
        const err = gl.getProgramInfoLog( program );
        gl.deleteProgram( program );
        throw err;
    }

    // packaging program 

    const packageProgram = ( gl, program, vertex, fragment ) => {
        return {
            program: program,
            uniforms: getUniforms( gl, program, vertex, fragment ),
            attributes: getAttributes( gl, program, vertex, fragment ),
        }
    }

    const getParameter = ( text, key ) => {
        const regex = new RegExp(`(?<=${key} ).*`, 'g');
        const results = text.match(regex);
        return results ? results.map( x => x.substring(x.lastIndexOf(' ') + 1, x.length - 1)) : [];
    }

    const getUniforms = ( gl, program, vertex, fragment ) => {
        let keys = getParameter( vertex, 'uniform');
        keys = keys.concat( getParameter( fragment, 'uniform' ));
        keys = [...new Set( keys )];
        const uniforms = { };
        for(const key of keys) uniforms[key] = gl.getUniformLocation( program, key);
        return uniforms
    }

    const getAttributes = ( gl, program, vertex, fragment ) => {
        let keys = getParameter( vertex, 'attribute');
        keys = keys.concat( getParameter( fragment, 'attribute' ));
        keys = [...new Set( keys )];
        const attributes = { };
        for(const key of keys) attributes[key] = gl.getAttribLocation( program, key);
        return attributes       
    }

}
/** == -----------------------------------------
 * Methods
 == -------------------------------------------*/
 const draw = ( first, vertices, draw_method = "TRIANGLE_STRIP" ) => {
    gl.drawArrays( gl[draw_method], first, vertices );
}

const fill = color => {
    if( color instanceof String ) color =  convertHex( color );
    gl.clearColor(...color);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
}

const setAttribute = ( shader, attr_name, length, stride, offset ) => {
    const attr = shader.attributes[ attr_name ];
    gl.enableVertexAttribArray( attr );
    gl.vertexAttribPointer( attr, length, gl.FLOAT, false, stride * 4, offset * 4);
}

const createBuffer = data => {
    const buffer = gl.createBuffer( );
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW );
    return buffer;
}

const setBuffer = name => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[name]);
}

const setProjection = (matrix, rect) => {
    mat4.ortho( matrix, rect.left, rect.right, rect.bottom, rect.top, 1, -1 );
};

const setTexture = ( shader, texture, index ) => {
    gl.activeTexture( gl.TEXTURE0 + index);
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.uniform1i( shader.uniforms[`u_texture_${index}`], index );
}

const setTransform = ( matrix, object ) => {
    mat4.fromTranslation( matrix, object.position );
    mat4.rotateX( matrix, matrix, object.rotation[0] ); 
    mat4.rotateY( matrix, matrix, object.rotation[1] ); 
    mat4.rotateZ( matrix, matrix, object.rotation[2] );
    mat4.translate( matrix, matrix, [ -object.width * 0.5, -object.height * 0.5, 0 ]);
    mat4.scale( matrix, matrix, [object.width, object.height, 1]); 
}

const setTextureMatrix = (matrix, object, source) => {
    const w = object.width / source.size[0];
    mat4.fromRotationTranslationScale( matrix, [0, 0, 0, 0], [object.cell * w, 0, 0], [ w, 1, 1]);
}

const setUniform = ( shader, uniform_method, uniform_name, ...value ) => {
    const uniform = shader.uniforms[uniform_name];
    gl[uniform_method]( uniform, ...value );
}

const useShader = (name, shader) => {
    if( shader && shader == shaders[name]) return shader;
    shader = shaders[name];
    if(!shader) return false;
    gl.useProgram( shader.program );
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );
    return shader;
}

const convertHex2RGBA = color => {
    if(color instanceof Array) return color;
    if(color.split('#').length == 1) return null;
    let hex = color.split('#')[1];
    if(hex.length == 3) hex = bumpHex(hex);
    else if(hex.length == 6) hex += "FF";
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = parseInt(hex.slice(6, 8), 16);
    return [r / 255, g / 255 , b / 255, a / 255];
}

const createTexture = bitmap => {
    const texture = gl.createTexture( );
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
    if(powerOf2(bitmap.width) && powerOf2(bitmap.height)) gl.generateMipmap(gl.TEXTURE_2D);
    else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    return { texture: texture, size: [bitmap.width, bitmap.height] };
}

const setPalette =  data => {
    data = new Uint8Array(data);
    gl.bindTexture  (gl.TEXTURE_2D, textures.palette_group);
    gl.pixelStorei  (gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D   (gl.TEXTURE_2D, 0, gl.LUMINANCE, data.length, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

const powerOf2 = n => {
    return (n & (n - 1) == 0 );
}

const bumpHex = hex => {
    hex = hex.slice(0, 1) + hex.charAt(0) + hex.slice(1);
    hex = hex.slice(0, 2) + hex.charAt(2) + hex.slice(2);
    hex = hex.slice(0, 4) + hex.charAt(4) + hex.slice(4);
    hex += 'FF';
    return hex; 
}

const debug_report_buffer = ( ) => {
    console.log(gl.getParameter(gl.VIEWPORT));
    console.log(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));
    console.log(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_USAGE));
}

//========================================================
// Render Methods
//========================================================


const render = object => {
    const shader = useShader( object.shader );
    if( !shader ) throw `Invalid shader [${object.shader}] `;
    switch( object.shader ) {
        case 'single_texture': renderSingleTexture( shader, object ); break;
        case 'rumbler': renderRumbler( shader, object ); break;
    }
    return shader;
}


const renderSingleTexture = (shader, object) => {
    const source = textures[object.textures[0]];
    setTexture( shader, source.texture, 0);
    // ==========================================
    setBuffer( 'position');
    setAttribute( shader, 'a_position', 2, 0, 0);
    // ==========================================
    gl.uniformMatrix4fv(shader.uniforms.u_projection, false, m0);
    // ==========================================
    setTransform( m1, object );
    gl.uniformMatrix4fv(shader.uniforms.u_transform,  false, m1);
    // ==========================================
    gl.uniform4fv( shader.uniforms.u_tint, object.tint );
    // ==========================================
    draw(0, 4);
}

const renderRumbler = (shader, object) => {
    const source = textures[object.textures[0]];
    setTexture( shader, source.texture, 0);
    // ==========================================
    setBuffer( 'position');
    setAttribute( shader, 'a_position', 2, 0, 0);
    // ==========================================
    setTexture( shader, textures.palette.texture, 1);
    gl.uniform2fv( shader.uniforms.u_palette_size, textures.palette.size );
    // ==========================================
    setTexture( shader, textures.palette_group.texture, 2);
    setPalette( object.palette );
    gl.uniform2iv( shader.uniforms.u_map_size, [object.palette.length, 1]);
    // ==========================================
    gl.uniformMatrix4fv(shader.uniforms.u_projection, false, m0);
    // ==========================================
    setTransform( m1, object );
    gl.uniformMatrix4fv(shader.uniforms.u_transform,  false, m1);
    // ==========================================
    setTextureMatrix( m2, object, source );
    gl.uniformMatrix4fv( shader.uniforms.u_texMatrix, false, m2);
    // ==========================================
    gl.uniform4fv( shader.uniforms.u_tint, object.tint );
    // ==========================================
    draw(0, 4);
    if(DEBUG) renderBoxes( object );
}

const renderBoxes = object => {
    const shader = useShader('color');
    renderBox(shader, object, object.rect, [0, 1, 0, 0.3]);
    for( const hurtbox of object.hurtboxes ) renderHurtbox( shader, object, hurtbox);
    for( const hitbox of object.hitboxes ) renderHitbox( shader, object, hitbox);
}

const renderBox = (shader, object, box, color) => {
    setBuffer('position');
    // ==========================================
    setAttribute(shader, 'a_position', 2, 0, 0);
    // ==========================================
    gl.uniformMatrix4fv(shader.uniforms.u_projection, false, m0);
    // ==========================================
    const x = object.position[0] + box.x - box.width * 0.5;
    const y = object.position[1] + box.y - box.height * 0.5;
    mat4.fromRotationTranslationScale( m1, [0, 0, 0, 0], [x, y, 0], [box.width, box.height, 1]);
    gl.uniformMatrix4fv(shader.uniforms.u_transform,  false, m1);
    // ==========================================
    gl.uniform4fv( shader.uniforms.u_tint, color );
    // ==========================================
    draw(0, 4);

}

const renderHurtbox = (shader, gameobject, box) => {
    const rect = Object.assign({
        left: gameobject.position[0] + box.x,
        top: gameobject.position[1] + box.y
    }, box);
    renderBox( shader, gameobject, rect, [0, 0, 1, 0.3]);
}

const renderHitbox = (shader, gameobject, box) => {
    const rect = Object.assign({
        left: gameobject.position[0] + box.x,
        top: gameobject.position[1] + box.y
    }, box);
    renderBox( shader, gameobject, rect, [1, 0, 0, 0.3]);
}
/** == -----------------------------------------
 * Setting Routes 
 == -------------------------------------------*/
Messenger.setRoute('init', function( message ) {
    gl = message.content.getContext('webgl', {premultipledAlpha: false});
    buffers.square = createBuffer(new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]));
    textures.palette_scheme = gl.createTexture( );
    return true;
});

Messenger.setRoute('compile', async function( message ) {
    shaders[message.content.name] = await compile( gl, message.content.vertex, message.content.fragment );
    console.log('Compiled Shader:', message.content.name)
    return true;
});

Messenger.setRoute('fill', function( message ) {
    fill( message.content );
    return true;
})


Messenger.setRoute('texture', function(message) {
    const texture = createTexture( message.content.bitmap );
    textures[ message.content.name] = texture;
    return true;
});

Messenger.setRoute('render', function( message ) {
    fill([0, 0, 0.2, 1]);
    if( !message.content.camera ) return;
    setProjection( m0, message.content.camera );
    for( const object of message.content.objects ) shader = render( object, shader );

});