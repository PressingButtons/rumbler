export function drawTilemap(gl, ar_shader, buffer, tileTexture, mapTexture, transform, projection) {
  setBuffer(gl, buffer);
  activateTexture(gl, 0, mapTexture.texture, ar_shader.uniforms.mapTexture);
  activateTexture(gl, 1, tileTexture.texture, ar_shader.uniforms.tileTexture);
  gl.uniformMatrix4fv(ar_shader.uniforms.projection, false, projection);
  gl.uniformMatrix4fv(ar_shader.uniforms.transform, false, transform);
  gl.drawArrays(gl.TRIANGLES, 0 ,6);
}

export function colorFill(gl, color = [0, 0, 0, 1]) {
  gl.clearColor(...color);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
}

export function createBuffer(gl, bufferData) {
  return setBuffer(gl, gl.createBuffer( ), bufferData);
}

export function setShader(gl, ar_shader) {
  gl.useProgram(ar_shader.program);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

//methods
const activateAttribute = (gl, attr, size, stride, offset) => {
  gl.enableVertexAttribArray(attr);
  gl.vertexAttribPointer(attr, size, gl.FLOAT, false, stride * 4, offset * 4); //always glFloat cause LAZZZZZZY
}

const activateTexture = (gl, index, texture, uniform, repeat = false) => {
  gl.activeTexture(gl.TEXTURE0 + index);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  if(repeat) {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  }
  gl.uniform1i(uniform, index);
}

const setBuffer = (gl, buffer, bufferData) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  if(bufferData) gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
  return buffer;
}
