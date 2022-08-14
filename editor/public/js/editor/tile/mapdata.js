export default class MapData extends Editor.ListenerGroup {

  #source;
  #config;
  #outctx;
  #maptxt;
  #tiletxt;
  #gl;
  #coord = [0, 0];

  constructor( ) {
    super( );
    this.bindElement(document, 'stamp', this.#onStamp.bind(this));
  }

  async init(gl, tiles) {
    this.#gl = gl;
    await this.#loadData( );
    this.#outctx = System.dom.createContext('2d', System.MAP_COLUMNS, System.MAP_ROWS * 4);
    this.#outctx.imageSmoothingEnabled = false;
    this.#maptxt = new Arachnid.Texture( );
    this.#tiletxt = new Arachnid.Texture( );
    this.#tiletxt.useImage(gl, tiles);
    this.selectMap(0);
    this.#outputMap( );
  }

  selectMap(i) {
    const w = System.MAP_COLUMNS;
    const h = System.MAP_ROWS;
    this.#outctx.drawImage(this.#source.canvas, w * i, 0, w, h, 0, 0, w, h * 4);
    this.#coord[0] = i * System.MAP_COLUMNS;
  }

  selectRow(i) {
    this.#coord[1] = i;
  }

  //private
  #convertToColor(cell) {
    const index = cell.split(":").map( x => Number(x).toString(16).padStart(2, '0')).join("");
    if(index != "0000") return "#" + index + "00FF";
    else return null;
  }

  #getPosition(cell, range, grid) {
    const coord = Editor.Calc.gridToPoint(cell).map((x, i) => (x - range[i]) / System.TILESIZE);
    coord[0] += grid[1] + System.MAP_COLUMNS * this.#coord[0];
    coord[1] += grid[0] + System.MAP_ROWS * this.#coord[1];
    return coord;
  }

  async #loadData( ) {
    let pkg = await System.assetLoader.loadMapData( );
    this.#source = pkg["data.webp"];
    this.#config = pkg["config.json"];
  }

  #onStamp(event) {
    this.selectMap(this.#coord[0]);
    if(!this.#source) return;
    for(const cell of event.detail.cells) this.#plotCell(cell, event.detail);
    this.#outputMap( );
  }

  #outputMap( ) {
    this.#maptxt.useImage(this.#gl, this.#outctx.canvas);
    document.dispatchEvent(new CustomEvent('drawmap', {detail: {
      tiles: this.#tiletxt,
      map: this.#maptxt,
      src: this.#outctx.canvas
    }}));
  }

  #plotCell(cell, data) {
    const point = this.#getPosition(cell, data.range, data.position.grid);
    const color = this.#convertToColor(cell);
    this.#source.clearRect(...point, 1, 1);
    console.log(point, color);
    if(color) {
      this.#source.fillStyle = color;
      this.#source.fillRect(...point, 1, 1);
    }
  }

}
