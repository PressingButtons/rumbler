export default class MapView extends Editor.ListenerGroup {

  #ctx;

  constructor( ) {
    super( );
  }

  init(html) {
    this.#ctx = System.dom.createContext('2d', System.MAP_COLUMNS, System.MAP_ROWS * 4, null, html.querySelector('#map_view'));
    this.bindElement(document, 'drawmap', this.#onDrawMap.bind(this));
  }

  #onDrawMap(event) {
    this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
    this.#ctx.drawImage(
      event.detail.src,
      event.detail.coord[0], event.detail.coord[1], System.MAP_COLUMNS, System.MAP_ROWS * 4,
      0, 0, System.MAP_COLUMNS, System.MAP_ROWS * 4
    )
  }

}
