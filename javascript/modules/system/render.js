const attrLength = Float32Array.BYTES_PER_ELEMENT;
let gl, programs, currentShader, m4;
let glBuffer;

export function init(glContext, shaderPrograms) {
  m4 = glMatrix.mat4 || mat4 || null;
  if(!m4) GameSystem.sendError(null, GameSystem.ErrorMessages.GLMATRIX_NOT_DEFINED);
  gl = glContext;
  programs = shaderPrograms;
  glBuffer = GameSystem.createGlBuffer(gl, GameSystem.bufferData.textureSquare);
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

drawMethods.clear = (color = [0, 0, 0, 1]) => {
  gl.clearColor(...color);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
}

drawMethods.gameMap = function(camera, map) {
  try {
    activateShader(programs.tiles);
    drawMethods.clear(map.backgroundColor);
    for(let i = 0; i < map.layers.length; i++) drawMethods.tileLayer(camera, map, i);
  } catch(err) {
    GameSystem.sendError(err, 'Failure to draw GameMap.');
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

drawMethods.tileLayer = function(camera, map, index) {
  if(!map.layers[index].texture.hasTexture) return;
  const layer = map.layers[index];
  setTSBuffer( );
  activateTexture(0, layer.texture.texture, currentShader.uniforms.uTileLayer);
  gl.uniformMatrix4fv(currentShader.uniforms.u_projection_matrix, false, camera.projection);
  setTransform([0, 0, 0, 0], [0, 0, 0, 0], [1280, 720, 1]);
  gl.uniform4fv(currentShader.uniforms.u_tint,  [1, 1, 1, 1]);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
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
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    currentShader = program;
  } catch(error) {
    throw error;
  }
}

function activateTexture(index, texture, uniform, repeat = false) {
  gl.activeTexture(gl.TEXTURE0 + index);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  if(repeat) {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  }
  gl.uniform1i(uniform, index);
}

function setTransform(rotation, translation, scale) {
  const transform = m4.fromRotationTranslationScale(GameSystem.bufferData.transform, rotation, translation, scale);
  gl.uniformMatrix4fv(currentShader.uniforms.u_transform_matrix, false, transform);

}

function setTSBuffer( ) {
  useBuffer(GameSystem.bufferData.textureSquare);
  activateAttribute(currentShader.attributes.a_position, 2, 4, 0);
  activateAttribute(currentShader.attributes.a_texCoord, 2, 4, 2);
}

function useBuffer(bufferData) {
  gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
  if(bufferData) gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
}
