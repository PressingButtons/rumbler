export default class TileLayer {


  constructor(rows, columns) {
    this.ctx = System.createContext2D(rows * System.TILESIZE, columns * System.TILESIZE);
    this.data = this.ctx.getImageData(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  plot(index, start, value) {
    index = index.split(':');
    const startCoord = rowIndex(start.row) + colIndex(start.col);
    const plotCoord = startCoord + rowIndex(index[0]) + colIndex(index[1]);
    this.data.splice(plotCoord, System.PIXEL_LENGTH, value);
  }

  plotGroup(data) {
    for(const index in data.values) plot(index, data.start, data.values[index]);
  }

  getTile(row, col) {
    const index = rowIndex(row) + colIndex(col);
    return this.data.slice(index, index + System.PIXEL_LENGTH);
  }

  pack( ) {
    return this.ctx.canvas.toDataURL('image/webp', 1);
  }

  async unpack(data) {
    const source = await System.loadImage(data);
    this.ctx.drawImage(source, 0, 0);
  }

}

const rowIndex = row => {
  return row * System.MAP_COLUMNS * System.PIXEL_LENGTH;

}

const colIndex = col => {
  return col * System.PIXEL_LENGTH;

}
