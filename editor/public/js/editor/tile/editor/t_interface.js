import tilemap from './tilemap.js';
import tileset from './tileset.js';
import renderMap from './t_render.js';

let layers;

export async function init( ) {
  await tileset.init( );
  await tilemap.init( );
  tileset.addEventListener('stampdata', onSelectTiles);
  document.addEventListener('mapupdate', onMapUpdate);
}

const onSelectTiles = event => {
  tilemap.setTiles(tileset.image, event.detail);
}

const onMapUpdate = event => {
  renderMap(document.getElementById('tileset'), tilemap.canvases, event.detail);
}
