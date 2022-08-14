export default class MapData extends Editor.ListenerGroup {

  #config;
  #source;
  #gl;
  #index = 0;
  #coord = [0, 0]


  constructor( ) {
    super( );
    this.bindElement(document, 'stamp', this.#onStamp.bind(this));
  }

  async init(gl) {
    this.#gl = gl;
    await this.#loadData( );
    this.#outputMap( );
  }

  selectMap(i) {
    this.#index = i;
    this.#coord[0] = System.MAP_COLUMNS * i;
  }

  selectLayer(i) {
    this.#coord[1] = System.MAP_ROWS * i;
  }

  //private
  #convertToColor(cell) {
    const index = cell.split(":").map( x => Number(x).toString(16).padStart(2, '0')).join("");
    if(index != '0000') return '#' + index + '00FF';
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
    if(!this.#source) return;
    for(const cell of event.detail.cells) this.#plotCell(cell, event.detail);
    this.#outputMap( );
  }

  #outputMap( ) {
    document.dispatchEvent(new CustomEvent('drawmap', {detail: {
      src: this.#source.canvas,
      coord: this.#coord
    }}));
  }

  #plotCell(cell, data) {
    const point = this.#getPosition(cell, data.range, data.position.grid);
    const color = this.#convertToColor(cell);
    if(color == null) this.#source.clearRect(...point, 1, 1);
    else {
      this.#source.fillStyle = color;
      this.#source.fillRect(...point, 1, 1);
    }
  }
}
