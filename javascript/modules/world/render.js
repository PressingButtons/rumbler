let currentShader = null;
let gamescreen = null;

export default function Render(world) {
  clear(world.backgroundColor);
  if(world.background) drawTexture(world, world.background);
}


function clear(color) {
  gl.clearColor(...color);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function useProgram(shader) {
  if(currentShader == program) return;
  currentShader = program;
  gl.useProgram(program);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  return shader;
}

function drawBackground(background) {

}

function drawTexture(world, object) {
  const shader = useProgram(Game.Shaders.basic);
  bindBuffer(gl.ARRAY_BUFFER, object.displayBuffer);
  Arachnid.enableBufferVertexAttribute(shader.attributes.a_position, 2, gl.FLOAT, false, 4, 0);
  Arachnid.enableBufferVertexAttribute(shader.attributes.a_text_coord, 2, gl.FLOAT, false, 4, 2);
  gl.uniformMatrix4fv(shader.uniforms.u_projection_matrix, false, world.camera.projection);
  gl.uniformMatrix4fv(shader.uniforms.u_transform_matrix, false, object.transform);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
