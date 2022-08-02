const attrLength = Float32Array.BYTES_PER_ELEMENT;
let gl, programs, currentShader;

export function init(glContext, shaderPrograms) {
  gl = glContent;
  programs = shaderPrograms;
}

export function drawObject(object, camera, config = { }) {
  const data = {
    buffer: object.buffer,
    textures: object.textures,
    projection: camera.projection,
    position_transform: object.transform,
    texture_transform: object.currentFrame,
    tint: config.tint
  }
  drawMethods.gameTexture(object)
}

const drawMethods = {};

drawMethods.basicTexture = function(data, camera) {
  try {
    activateShader(programs.basic);
    useBuffer(data.buffer, data.bufferData);
    activateAttribute(currentShader.attributes.a_position, 2, 4, 0);
    activateAttribute(currentShader.attributes.a_text_coord, 2, 4, 2);
    activateTexture(0, data.textures[0].texture, currentShader.uniforms.u_texture0);
    gl.uniformMatrix4fv(currentShader.uniforms.u_project_matrix, false, data.projection);
    gl.uniformMatrix4fv(currentShader.uniforms.u_transform_matrix, false, data.position_transform);
    gl.uniformMatrix4fv(currentShader.uniforms.u_texture_matrix, false, data.texture_transform);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  } catch(err) {
    console.trace( );
    throw err;
  }
}

drawMethods.gameTexture = function(data) {
  try {
    activateShader(programs.gameTexture);
    useBuffer(data.buffer, data.bufferData);
    activateAttribute(currentShader.attributes.a_position, 2, 4, 0);
    activateAttribute(currentShader.attributes.a_text_coord, 2, 4, 2);
    activateTexture(0, data.textures[0].texture, currentShader.uniforms.u_base);
    activateTexture(1, data.textures[1].texture, currentShader.uniforms.u_palette);
    gl.uniformMatrix4fv(currentShader.uniforms.u_project_matrix, false, data.projection);
    gl.uniformMatrix4fv(currentShader.uniforms.u_transform_matrix, false, data.position_transform);
    gl.uniformMatrix4fv(currentShader.uniforms.u_texture_matrix, false, data.texture_transform);
    gl.uniform4fv(currentShader.uniforms.u_tint, data.tint || [0, 0, 0, 0]);
    gl.uniform2fv(currentShader.uniform.u_palette_dim, [data.textures[1].width, data.textures[1].height])
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  } catch(err) {
    console.trace( );
    throw err;
  }
}

drawMethods.tileLayer = function(data) {
  try {
    activateShader(program.tiles);
    useBuffer(data.buffer, new Float32Array(0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0));
    activateAttribute(currentShader.attributes.a_position, 2, 4, 0);
    activateAttribute(currentShader.attributes.a_text_coord, 2, 4, 2);
    activateTexture(0, data.textures[0].texture, currentShader.uniforms.u_map);
    activateTexture(1, data.textures[1].texture, currentShader.uniforms.u_tiles);
    gl.uniformMatrix4fv(currentShader.uniforms.u_project_matrix, false, data.projection);
    gl.uniformMatrix4fv(currentShader.uniforms.u_transform_matrix, false, data.position_transform);
    gl.uniform4fv(currentShader.uniforms.u_tint, data.tint || [0, 0, 0, 0]);
    gl.uniform1i(currentShader.uniforms.u_tilesize, data.tilesize);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  } catch(err) {
    console.trace( );
    throw err;
  }
}

export {drawMethods};

function activateAttribute(attribute, size, stride, offset) {
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, stride * attrLength, offset * attrLength);
}

function activateShader(program) {
  if(currentShader == program) return;
  else try {
    gl.useProgram(program.program);
    currentShader = program;
  } catch(error) {
    throw error;
  }
}

function useBuffer(buffer, bufferData) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  if(bufferData) gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
}
