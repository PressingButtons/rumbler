export default class MapView extends Editor.ListenerGroup {

  #ctx;
  #scale = 3;

  constructor( ) {
    super( );
  }

  init(html) {
    this.#ctx = System.dom.createContext('2d', System.MAP_COLUMNS * this.#scale, System.MAP_ROWS * 4 * this.#scale, null, html.querySelector('#map_view'));
    this.#ctx.scale(this.#scale, this.#scale);
    this.bindElement(document, 'drawmap', this.#onDrawMap.bind(this));
  }

  #onDrawMap(event) {
    this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
    this.#ctx.drawImage(event.detail.src, 0, 0);
  }

}
