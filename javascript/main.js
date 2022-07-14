import '../ArachnidJS/lib.js';

window.onload = event => {
  window.gl = document.getElementById('game').getContext('webgl', {premultipliedAlpha: false});
  console.log(Arachnid)
  Arachnid.compileWebGL(gl, './shaders/config.json').then(test);
}

const test = shaders => {
  console.log(shaders);
}
