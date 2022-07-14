import '../ArachnidJS/lib.js';
import './modules/game/game.js';

window.onload = event => {
  window.gl = document.getElementById('game').getContext('webgl', {premultipliedAlpha: false});
  Arachnid.compileWebGL(gl, './shaders/config.json').then(Game.main);
}
