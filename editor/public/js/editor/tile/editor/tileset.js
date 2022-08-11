class TileSet extends EventTarget {

  #handleMouseEvent = {
    mousemove: function(position) {
      this.#hideMarker(false);
      this.#moveMarker(position.coord);
      if(this.#active) this.#setCell(position)
    },
    mousedown: function(position) {
      this.#active = true;
      this.#clearHilites( );
      this.#setCell(position);
    },
    mouseup: function(position) {
      this.#active = false;
      this.#sendCells( );
    },
    mouseout: function(position) {
      this.#active = false;
      this.#hideMarker( );
    }
  };

  #active = false;
  #cells = new Set( );

  constructor( ) {
    super( );
  }

  get marker( ) {return this.svg.querySelector('#marker')}
  get hilites( ) {return this.svg.querySelector('#hilite')}

  async init( ) {
    this.image = await System.load.loadImage('/assets/stages/tiles.webp', document.getElementById('tileset'));
    this.svg = document.querySelector('.tileset .tilesvg');
    this.#setMouseListeners(this.svg.querySelector('#listener'));
  }

  //private
  #clearHilites( ) {
    this.#cells.clear( );
    while(this.hilites.firstChild) this.hilites.removeChild(this.hilites.firstChild);
  }

  #handleMouse(event) {
    let point = System.mouse.mousePoint(event);
    let position = App.Tiles.calc.pointToTilePosition(point);
    this.#handleMouseEvent[event.type].call(this, position);
  }

  #hideMarker(bool = true) {
    this.marker.setAttribute('stroke', bool ? 'none' : 'red');
  }

  #hiliteCell(coord) {
    const rect = System.dom.createSVG(
      'rect',
      "http://www.w3.org/2000/svg",
      {x: coord[0], y: coord[1], width: App.Tiles.TILESIZE, height: App.Tiles.TILESIZE}
    );
    this.hilites.append(rect);
  }

  #moveMarker(position) {
    this.marker.setAttribute('x', position[0]);
    this.marker.setAttribute('y', position[1])
  }

  #sendCells( ) {
    this.dispatchEvent(new CustomEvent('stampdata', {detail: [...this.#cells]}));
  }

  #setCell(position) {
    const id = position.grid.join(':');
    if(this.#cells.has(id)) return;
    this.#cells.add(id);
    this.#hiliteCell(position.coord);
  }

  //mouse event handlers

  #setMouseListeners(element) {
    element.onmousedown = this.#handleMouse.bind(this);
    element.onmousemove = this.#handleMouse.bind(this);
    element.onmouseup = this.#handleMouse.bind(this);
    element.onmouseout = this.#handleMouse.bind(this);
  }

}

export default new TileSet( );
