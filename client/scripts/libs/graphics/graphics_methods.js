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
    mat4.ortho( matrix, rect.left, rect.right, rect.bottom, rect.top, 1, -1);
};

const setTexture = ( shader, texture, index ) => {
    gl.activeTexture( gl.TEXTURE0 + index);
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.uniform1i( shader.uniforms[`u_texture_${index}`], index );
}

const setTransform = ( matrix, object ) => {
    const position = [ object.position[0] - object.half_w,  object.position[1] - object.half_h, 0 ];
    mat4.fromTranslation( matrix, position );
    mat4.rotateX( matrix, matrix, object.rotation[0] ); 
    mat4.rotateY( matrix, matrix, object.rotation[1] ); 
    mat4.rotateZ( matrix, matrix, object.rotation[2] );
    mat4.translate( matrix, matrix, [ object.half_w, object.half_h, 0 ]);
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
}