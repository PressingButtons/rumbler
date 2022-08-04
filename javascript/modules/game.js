import * as GameMap from './gamemap/gamemap.js';
import * as GameRender from './system/render.js';
import camera from './objects/camera.js';

let shaders;

export async function init(pkg) {
  shaders = pkg.shaders;
  await GameMap.init(pkg.gl);
  await GameRender.init(pkg.gl, pkg.shaders);
  loadLevel(pkg.gl, 'prototype');
}

async function loadLevel(gl, name) {
  await GameMap.load('prototype');
  const map = GameMap.getMap( );
  GameRender.drawMethods.gameMap(camera, map);
  document.addEventListener('keyup', event => {
    const key = event.key.toLowerCase( );
    if(key == 'arrowdown') { camera.y -= 100;}
    if(key == 'arrowup') { camera.y += 100;}

    GameRender.drawMethods.gameMap(camera, map);
  })
}
