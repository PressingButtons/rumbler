import * as GameRender from './render.js';

window.GameSystem = { };

GameSystem.sendError = (err, desc) => {
  console.log('Error ------------------------->');
  console.error(desc);
  console.trace( );
  console.log('Error ------------------------->');
  throw err;
}

GameSystem.createGlBuffer = (gl, data) => {
  const buffer = gl.createBuffer( );
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return buffer;
}

GameSystem.bufferData = Arachnid.defineBuffer({ }, {
  work: [Float32Array, 16],
  transform: [Float32Array, 16],
  projection: [Float32Array, 16],
  textureSquare: [Float32Array, 24],
  backgroundColor: [Float32Array, 4],
  mapLayerTints: [Float32Array, 12],
  collisionTiles: [Uint8ClampedArray, (80 * 45)]
})

GameSystem.bufferData.textureSquare.set([
  0, 0, 0, 0,
  1, 0, 1, 0,
  0, 1, 0, 1,
  0, 1, 0, 1,
  1, 1, 1, 1,
  1, 0, 1, 0
]);

GameSystem.ErrorMessages = {
  GLMATRIX_NOT_DEFINED: 'glMatrix(m4) not definied. Cannot perform Matrix operations!'
}

GameSystem.Attributes = { };
GameSystem.Attributes.TILESIZE = 16;
