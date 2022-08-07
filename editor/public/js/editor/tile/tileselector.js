export default class TileSelector extends EventTarget {

  body;
  #isDown = false;
  #cells = { };

  constructor(svg) {
    super( );
    this.body = svg;
    this.#init( );
  }


  #init( ) {
    this.#setListeners(this.body.querySelector('#listener'));
    System.loadImage('/assets/stages/tiles.webp', document.getElementById('tileset'));
  }

  #setListeners(listener) {
    listener.onmousemove = this.#onmouseaction.bind(this);
    listener.onmousedown = this.#onmouseaction.bind(this);
    listener.onmouseup = this.#onmouseaction.bind(this);
    listener.onmouseout = this.#onmouseaction.bind(this);
  }

  #clearCells( ) {
    this.#cells = { };
    const hilite = this.body.querySelector('#hilite');
    while(hilite.firstChild) hilite.removeChild(hilite.firstChild);
  }

  #hideMarker(invisible = true) {
    let value = invisible ? 'none' : 'red';
    this.body.querySelector('#marker').setAttribute('stroke', value);
  }

  #hiliteCells( ) {
    const hilite = this.body.querySelector('#hilite');
    for(const cell in this.#cells) {
      this.#setCell(hilite, this.#cells, cell);
      this.#cells[cell] = true;
    }
  }

  #moveMarker(position) {
    let y = position.row * System.TILESIZE;
    let x = position.col * System.TILESIZE;
    this.body.querySelector('#marker').setAttribute('x', x);
    this.body.querySelector('#marker').setAttribute('y', y);
  }

  #onmouseaction(event) {
    const position = System.calc.mousePosition(event);
    switch(event.type) {
      case 'mousemove': this.#onMouseMove(position); break;
      case 'mousedown': this.#onMouseDown(position); break;
      case 'mouseup':   this.#onMouseUp(position);   break;
      case 'mouseout':  this.#onMouseOut(position);  break;
    }
  }

  #onMouseMove(position) {
    this.#hideMarker(false);
    this.#moveMarker(position);
    if(!this.#isDown) return;
    this.#trackCells(position);
    this.#hiliteCells( );
  }

  #onMouseDown(position) {
    this.#isDown = true;
    this.#clearCells( );
    this.#trackCells(position);
    this.#hiliteCells( );
  }

  #onMouseUp(position) {
    this.#isDown = false;
    this.#releaseData( );
  }

  #onMouseOut(position) {
    this.#isDown = false;
    this.#hideMarker(true);
  }

  #releaseData( ) {
    this.dispatchEvent(new CustomEvent('tileselection', {detail: this.#cells}));
  }

  #setCell(container, cells, name) {
    if(cells[name]) return;
    const config = System.calc.tileRect(name);
    const rect = System.dom.createSVG('rect', "http://www.w3.org/2000/svg", config);
    container.append(rect);
    cells[name] = true;
  }

  #trackCells(position) {
    const index = position.row + ":" + position.col;
    if(!this.#cells[index]) this.#cells[index] = false;
  }
}
