import * as GameMap from './objects/gamemap.js';
import * as GameRender from './system/render.js';
import Camera from './objects/camera.js';

let shaders;

export async function init(pkg) {
  shaders = pkg.shaders;
  await GameMap.init(pkg.gl);
  loadLevel(pkg.gl, 'prototype');
}

async function loadLevel(gl, name) {
  await GameMap.load(gl, 'prototype');
  const map = GameMap.getMap( );
  console.log(map);
}
