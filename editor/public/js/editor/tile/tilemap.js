export default class Tilemap extends Editor.ListenerGroup {

  #listeners = new Editor.ListenerGroup( );
  #mouseListener;
  #stamp;
  #ctx;
  #gl;

  //
  #active = false;
  #data;

  constructor(html) {
    super( );
    this.#init(html);
  }

  #init(html) {
    this.#gl = System.dom.createContext('gl', System.MAP_WIDTH, System.MAP_HEIGHT, {premultipliedAlpha: false}, html.querySelector('#tilemap_view'));
    this.#mouseListener = html.querySelector('#listener');
    this.#stamp = html.querySelector('#stamper');
    this.#ctx = System.dom.createContext('2d', System.TILESIZE, System.TILESIZE, {premultipliedAlpha:false}, this.#stamp.querySelector('canvas'));
    this.#listeners.bindElement(this.#mouseListener, 'mousedown', this.#handleMouse.bind(this));
    this.#listeners.bindElement(this.#mouseListener, 'mousemove', this.#handleMouse.bind(this));
    this.#listeners.bindElement(this.#mouseListener, 'mouseover', this.#handleMouse.bind(this));
    this.#listeners.bindElement(this.#mouseListener, 'mouseout', this.#handleMouse.bind(this));
    this.#listeners.bindElement(this.#mouseListener, 'mouseup', this.#handleMouse.bind(this));
    this.#onMouseOut( );
    this.#resizeStamp(System.TILESIZE, System.TILESIZE);
    this.#listeners.bindElement(document, 'tileselection', this.#onTileSelection.bind(this));
  }

  get tileset( ) {
    return document.getElementById('tileset');
  }

  #drawStampCells(range, values) {
    for(const cell of values.cells) {
      const point = Editor.Calc.gridToPoint(cell);
      const x = point[0] - range[0];
      const y = point[1] - range[1];
      this.#ctx.drawImage(this.tileset, point[0], point[1], System.TILESIZE, System.TILESIZE, x, y, System.TILESIZE, System.TILESIZE);
    }
  }

  #handleMouse(event) {
    let point = System.mouse.mousePoint(event);
    let position = Editor.Calc.pointToTilePosition(point);
    switch (event.type) {
      case 'mousedown': this.#onMouseDown(position); break;
      case 'mousemove': this.#onMouseMove(position); break;
      case 'mouseover': this.#onMouseOver(position); break;
      case 'mouseout':  this.#onMouseOut(position);  break;
      case 'mouseup':   this.#onMouseUp(position);   break;
    }
  }


  #moveStamp(position) {
    this.#stamp.style.transform = `translate(${position.coord[0]}px, ${position.coord[1]}px)`;
  }

  #onMouseDown(position) {
    this.#active = true;
    this.#sendStamp( );
  }

  #onMouseUp(position) {
    this.#active = false;
  }

  #onMouseMove(position) {
    this.#moveStamp(position);
    if(this.#active) this.#sendStamp(position);
  }

  #onMouseOver(position) {
    this.#stamp.style.visibility = "visible";
  }

  #onMouseOut(position) {
    this.#stamp.style.visibility = 'hidden';
  }

  #onTileSelection(event) {
    const range = Editor.Calc.tileRange(event.detail.cells);
    const width = range[2] - range[0], height = range[3] - range[1];
    this.#resizeStamp(width, height);
    this.#drawStampCells(range, event.detail);
    this.#data = {range: range, cells: cells}
  }

  #resizeStamp(width, height) {
    const rect = this.#stamp.querySelector('rect');
    const fo = this.#stamp.querySelector('foreignObject');
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    fo.setAttribute('width', width);
    fo.setAttribute('height', height);
    this.#ctx.canvas.width = width;
    this.#ctx.canvas.height = height;
  }

  #sendStamp(position) {
    this.#data.position = position;
    document.dispatchEvent(new CustomEvent('stamp', {detail: this.#data}));
  }

}
