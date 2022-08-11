import Stamper from './stamper.js';
import MapRender from './maprender.js';

export default class MapEditor extends EventTarget {

  #active = false;

  constructor(container) {
    super( );
    this.#init(container);
  }

  #init(container) {
    this.#bindMouseListener(container.querySelector('rect#listener'));
    this.stamper = new Stamper(container.querySelector('#stamper'));
    this.render = new MapRender(container.querySelector('.canvasLayers'));
    this.tilesrc = document.getElementById('tileset');
    this.body = container;
  }

  //public
  drawMap(map) {
    this.render.drawMap(this.tilesrc, map);
  }

  drawLayer(layer) {
    this.render.drawLayer(this.tilesrc, layer);
  }

  drawPlot(layer, values) {
    this.render.drawPlot(this.tilesrc, layer, values);
  }

  onSelection(event) {
    this.stamper.setValues(document.getElementById('tileset'), event.detail);
  }

  setStampData(image, data) {
    this.stamper.setValues(image, data);
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

  #packageValues(values, position) {
    let pkg = { };
    for(const index in values.keys) {
      const tile = index.split(':').map( x => parseInt(x));
      const cr = position.row + tile[0] - values.origin.row;
      const cc = position.col + tile[1] - values.origin.col;
      pkg[cr + ":" + cc] = index;
    }
    return pkg;
  }

  #sendStamp(position) {
    if(!this.stamper.values) return;
    const pkg = this.#packageValues(this.stamper.values, position);
    this.dispatchEvent(new CustomEvent('stamp', {detail: pkg}));
  }

}
