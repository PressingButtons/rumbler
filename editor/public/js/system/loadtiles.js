import {loadImage} from './loadImage.js';
import {createTexture} from './createTexture.js';

export default async function loadTiles(option = 0) {
  const image = await loadImage('/load/images/tiles.webp');

  if(option == 0) return createTexture(image);
  else if (option == 1) return createTileGroup(image);
  else {
    return {
      texture: createTexture(image),
      tileGroup: createTileGroup(image)
    }
  }
}

function createTileGroup(image) {
  const ts = 16;

  const columns = Math.floor(image.width / ts);
  const rows = Math.floor(image.height / ts);

  let tilegroup = {
    length: columns * rows,
    rows: rows,
    columns: columns,
    tiles: { }
  };

  for(let i = 0; i < rows; i++ ) {
    tilegroup.tiles[i] = { };
    for(let j = 0; j < columns; j++ ) {
      tilegroup.tiles[i][j] = createTile(image, i, j, ts);
    }
  }

  return tilegroup;

}

function createTile(image, row, column, tilesize) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, column * tilesize, row * tilesize, 0, 0, tilesize, tilesize);
  return canvas;
}
