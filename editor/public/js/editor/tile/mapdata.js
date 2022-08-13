export default class MapData {

  #listeners = new Editor.ListenerGroup( );
  #source;
  #config;
  #outctx;
  #maptxt;
  #tiletxt;
  #gl;

  constructor( ) {
    this.#listeners.bindElement(document, 'stamp', this.#onStamp.bind(this));
  }

  async init(gl, tiles) {
    this.#gl = gl;
    await this.#loadData( );
    this.#outctx = System.dom.createContext('2d', System.MAP_COLUMNS, System.MAP_ROWS * 4);
    this.#maptxt = new Arachnid.Texture( );
    this.#tiletxt = new Arachnid.Texture( );
    this.#tiletxt.useImage(gl, tiles);
    this.selectMap(0);
  }

  selectMap(i) {
    const w = System.MAP_COLUMNS;
    const h = System.MAP_ROWS;
    this.#outctx.drawImage(this.#source.canvas, w * i, 0, w, h, 0, 0, w, h * 4);
  }

  //private
  #convertToColor(cell) {
    const index = cell.split(":").map( x => x.toString(16).padStart(2, '0')).join("");
    return "#" + index + "00FF";
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
      map: this.#maptxt
    }}));
  }

  #plotCell(cell, data) {
    const point = Editor.Calc.gridToPoint(cell);
    const x = point[0] - data.range[0] + data.position[0];
    const y = point[1] - data.range[1] + data.position[1];
    this.#outctx.fillStyle = this.#convertToColor(cell);
    this.#outctx.fillRect(x, y, 1, 1);
  }

}
