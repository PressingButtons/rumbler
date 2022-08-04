import '../ArachnidJS/lib.js';
import './modules/system/sysmain.js';
import * as Game from './modules/game.js';
import preload from './preload.js';

window.onload = event => {

  const gl = document.getElementById('game').getContext('webgl', {premultipliedAlpha: false});

  preload(gl).then(main);

  async function main(pkg) {
    pkg.gl = gl;
    pkg.shaders = await Arachnid.compileWebGL(pkg.gl, './shaders/config.json');
    await Game.init(pkg);
  }

}
