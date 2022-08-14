export default class MapData extends Editor.ListenerGroup {

  #source;
  #config;
  #outctx;
  #maptxt;
  #tiletxt;
  #gl;

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
  }

  //private
  #convertToColor(cell) {
    const index = cell.split(":").map( x => Number(x).toString(16).padStart(2, '0')).join("");
    if(index != "0000") return "#" + index + "00FF";
    else return null;
  }

  async #loadData( ) {
    let pkg = await System.assetLoader.loadMapData( );
    this.#source = pkg["data.webp"];
    this.#config = pkg["config.json"];
  }

  #onStamp(event) {
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
    const point = Editor.Calc.gridToPoint(cell);
    const coord = point.map((x, i) => (x - data.range[i] + data.position.coord[i]) / System.TILESIZE);
    const color = this.#convertToColor(cell);
    this.#outctx.clearRect(...coord, 1, 1);
    if(color) {
      this.#outctx.fillStyle = this.#convertToColor(cell);
      this.#outctx.fillRect(...coord, 1, 1);
    }
  }

}
