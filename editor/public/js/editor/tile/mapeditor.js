export default class MapEditor extends EventTarget {

  constructor( ) {
    super( );
  }

  init(container) {
    this.#bindMouseListener(container.querySelector('rect#listener'));
    this.stamper = new Stamper(container.querySelector('#stamper'));
    this.canvases = container.querySelector('#canvasLayers');
    this.body = container;
  }

  //private
  #bindMouseListener(element) {
    element.onmousemove = this.#onmouse.bind(this);
    element.onmousedown = this.#onmouse.bind(this);
    element.onmouseup   = this.#onmouse.bind(this);
    element.onmouseout  = this.#onmouse.bind(this);
  }

  #onmouse(event) {
    const position = System.Calc.mousePosition(event);
    switch(event.type) {
      case "mousemove": this.#onmousemove(position); break;
      case "mousedown": this.#onmousedown(position); break;
      case "mouseup":   this.#onmouseup(position); break;
      case "mouseout":  this.#onmouseout(position); break;
    }
  }

  #onmousemove(position) {
    this.stamper.show( );
    this.stamper.move(position);
  }

  #onmousedown(position) {

  }

  #onmouseup(position) {

  }

  #onmouseout(position) {
    this.stamper.hide( );
  }

}
