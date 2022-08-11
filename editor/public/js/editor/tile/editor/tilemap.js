import Stamper from './stamper.js';


class Tilemap extends EventTarget {

  #handleMouseEvent = {
    mousemove: function(position) {
      this.stamper.show( );
      this.stamper.move(position.coord);
      if(this.active) this.sendStamp(position);
    },
    mousedown: function(position) {
      this.active = true;
      this.sendStamp(position);
    },
    mouseup: function(position) {
      this.active = false;
    },
    mouseout: function(position) {
      this.stamper.hide( );
    }
  };

  constructor( ) {
    super( );
  }

  async init( ) {
    this.body = document.querySelector('.tilemap');
    this.svg = this.body.querySelector('.tilesvg');
    this.stamper = new Stamper(this.svg.querySelector('#stamper'))
    this.#setMouseListeners(this.svg.querySelector('#listener'));
  }

  //public
  setTiles(image, cells) {
    this.cells = cells;
    this.stamper.drawCells(image, cells);
  }

  sendStamp(position) {
    document.dispatchEvent(new CustomEvent('stamp', {
      detail: {position: position, values: this.cells}
    }));
  }


  ///private
  #initCanvases(container) {
    const canvas = document.getElementById('tilemap_view');
    this.ctx = System.dom.createContext('gl', System.MAP_WIDTH, System.MAP_HEIGHT, {premultipliedAlpha: false});
  }

  /// non-init
  #handleMouse(event) {
    let point = System.mouse.mousePoint(event);
    let position = App.Tiles.calc.pointToTilePosition(point);
    this.#handleMouseEvent[event.type].call(this, position);
  }

  #setMouseListeners(element) {
    element.onmousedown = this.#handleMouse.bind(this);
    element.onmousemove = this.#handleMouse.bind(this);
    element.onmouseup = this.#handleMouse.bind(this);
    element.onmouseout = this.#handleMouse.bind(this);
  }

}


export default new Tilemap( );
