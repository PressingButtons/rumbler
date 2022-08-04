export default function GameMapLayer(index) {
  this.x = 0;
  this.y = 0;
  this.texture = new Arachnid.Texture( );
  this.tint = GameSystem.bufferData.mapLayerTints.subarray(index * 4, index * 4 + 4);
  this.tint.set([1, 1, 1, 1]);
}

GameMapLayer.prototype.reset = function( ) {
  this.texture.unload( );
  this.tint.set([1, 1, 1, 1]);
}

GameMapLayer.prototype.load = async function(gl, url, tiles, depth) {
  const map = await Arachnid.Loaders.loadImage(url);
  const src = createTileImage(map, tiles);
  let image = await Arachnid.Loaders.loadImage(src.toDataURL('image/webp', 0));
  await this.texture.load(gl, src.toDataURL('image/webp', 1));
}

const createTileImage = function(map, tiles) {
  const ctx = createCanvasContext(map.width, map.height);
  ctx.drawImage(map, 0, 0);
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  return drawLayer(imageData, tiles);
}

const createCanvasContext = function(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return ctx;
}

const drawLayer = function(imageData, tileset) {
  const ctx = createCanvasContext(imageData.width * GameSystem.Attributes.TILESIZE, imageData.height * GameSystem.Attributes.TILESIZE);
  const tilesize = GameSystem.Attributes.TILESIZE;
  for(let i = 0; i < imageData.data.length; i += 4) {
    const index = {column: imageData.data[i + 0], row: imageData.data[i + 1]};
    const x = ((i / 4) % imageData.width) * tilesize;
    const y = Math.floor((i / 4) / imageData.width) * tilesize;
    ctx.drawImage(tileset, index.column * tilesize, index.row * tilesize, tilesize, tilesize, x, y, tilesize, tilesize);
  }
  return ctx.canvas;
}
