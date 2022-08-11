export default class MapRender {

  constructor(container, map) {
    this.body = container;
    const width = System.MAP_COLUMNS * System.TILESIZE;
    const height = System.MAP_ROWS * System.TILESIZE;
    this.collision = System.dom.createContext2D(width, height, container.querySelector('#collision'));
    this.layer0 = System.dom.createContext2D(width, height, container.querySelector('#layer0'));
    this.layer1 = System.dom.createContext2D(width, height, container.querySelector('#layer1'));
    this.layer2 = System.dom.createContext2D(width, height, container.querySelector('#layer2'));
  }

  #init( ) {

  }

  clear( ) {
    this.collision.clearRect(0, 0, this.collision.canvas.width, this.collision.canvas.height);
    this.layer0.clearRect(0, 0, this.layer0.canvas.width, this.layer0.canvas.height);
    this.layer1.clearRect(0, 0, this.layer1.canvas.width, this.layer1.canvas.height);
    this.layer2.clearRect(0, 0, this.layer2.canvas.width, this.layer2.canvas.height);
  }

  drawMap(tiles, detail) {
    for(const name in detail.map) this.drawLayer(tiles, detail.map[name], this[name]);
  }

  drawLayer(tiles, source, layer) {
    const data = source.idata.data;
    for(let i = 0; i < data.length; i += 4) {
      const pixel = data.subarray(i, i + 4);
      if(pixel[0] + pixel[1] == 0) continue;
      let coord = System.calc.convertIndexToCoord(i);
      coord = coord.row + ':' + coord.col;
      let value = pixel[0] + ":" + pixel[1];
      this.drawTile(tiles, source.id, coord, value);
    }
  }

  drawPlot(tiles, layer, values) {
    for(const coord in values) {
      if(!values[coord]) continue;
        this.drawTile(tiles, layer.id, coord, values[coord]);
    }
  }

  drawTile(tiles, id, coord, value) {
    const ts = System.TILESIZE;
    coord = coord.split(':').map(x => parseInt(x) * ts);
    value = value.split(':').map(x => parseInt(x) * ts);
    this[id].drawImage(tiles, value[1], value[0], ts, ts, coord[1], coord[0], ts, ts);
    //layer.fillStyle = 'green'
    //layer.fillRect(destination.x, destination.y, ts, ts);
  }


  drawTiles(tiles, detail, layer) {
    const rect = System.calc.tileCrop(detail.values);
    const dx = detail.start.col * System.TILESIZE - rect.x;
    const dy = detail.start.row * System.TILESIZE - rect.y;
    for(let ti in detail.values) {
      const pos = ti.split(':').map(x => parseInt(x) * System.TILESIZE);
      const sx = pos[1], sy = pos[0];
      this.#setBrightness(layer);
      layer.clearRect(dx + sx, dy + sy, System.TILESIZE, System.TILESIZE);
      this.drawTile( document.getElementById('tileset'), sx, sy, dx + sx, dy + sy, layer)
    };
  }

  //private methods
  #clearTile(layer, index) {
    const coord = System.calc.convertIndexToCoord(index);
    layer.clearRect(coord.x, coord.y, System.TILESIZE, System.TILESIZE);
  }

  #setBrightness(layer) {
    if(layer == this.layer2) layer.filter = 'brightness(100%)';
    if(layer == this.layer1) layer.filter = 'brightness(85%)';
    if(layer == this.layer0) layer.filter = 'brightness(70%)';
  }

}

const nullPixel = (data, i) => {
  return (data[i + 0] == data[i + 1] == 0)
}
