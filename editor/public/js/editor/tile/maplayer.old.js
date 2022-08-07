export default class MapLayer {

  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
  }

  clear( ) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  drawMap(tiles, data) {
    for(let i = 0; i < data.length; i += System.PIXEL_LENGTH) this.drawTIle(i, data, tiles)
  }

  drawTile(i, data, tiles) {
    const coord = data.slice(i, i + System.PIXEL_LENGTH);
    const sx = coord[1] * System.TILESIZE;
    const sy = coord[0] * System.TILESIZE;
    const dx = ((i / System.PIXEL_LENGTH) % System.MAP_COLUMNS) * System.TILESIZE;
    const yx = Math.floor((i / System.PIXEL_LENGTH) / System.MAP_COLUMNS) * System.TILESIZE;
    this.ctx.clearRect(dx, dy, System.TILESIZE, SYSTEM.TILESIZE);
    this.ctx.drawImage(tiles, sx, sy, System.TILESIZE, System.TILESIZE, dx, dy, System.TILESIZE, System.TILESIZE);
  }

}
