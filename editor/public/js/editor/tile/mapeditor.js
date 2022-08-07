import Stamper from './stamper.js';

export default class MapEditor extends EventTarget {

  #active = false;

  constructor(container) {
    super( );
    this.#init(container);
  }

  #init(container) {
    this.#bindMouseListener(container.querySelector('rect#listener'));
    this.stamper = new Stamper(container.querySelector('#stamper'));
    this.canvases = container.querySelector('#canvasLayers');
    this.body = container;
  }

  //private
  #bindMouseListener(element) {
    element.onmouseover = this.#onmouse.bind(this);
    element.onmousemove = this.#onmouse.bind(this);
    element.onmousedown = this.#onmouse.bind(this);
    element.onmouseup   = this.#onmouse.bind(this);
    element.onmouseout  = this.#onmouse.bind(this);
  }

  #onmouse(event) {
    const position = System.calc.mousePosition(event);
    switch(event.type) {
      case "mouseover": this.#onmouseover(position); break;
      case "mousemove": this.#onmousemove(position); break;
      case "mousedown": this.#onmousedown(position); break;
      case "mouseup":   this.#onmouseup(position); break;
      case "mouseout":  this.#onmouseout(position); break;
    }
  }

  #onmouseover(position) {
    this.stamper.show( );
  }

  #onmousemove(position) {
    this.stamper.move(position);
    if(this.#active) this.#sendStamp(position);
  }

  #onmousedown(position) {
    this.#active = true;
    this.#sendStamp(position);
  }

  #onmouseup(position) {
    this.#active = false;
  }

  #onmouseout(position) {
    this.#active = false;
    this.stamper.hide( );
  }

  #sendStamp(position) {
    const pkg = {
      start: {row: position.row, col: position.col},
      values: this.stamper.values
    }
  }

  //public
  drawLayer(layer, canvas) {

  }

  onSelection(event) {
    this.stamper.setValues(document.getElementById('tileset'), event.detail);
  }

  setStampData(image, data) {
    this.stamper.setValues(image, data);
  }
}
