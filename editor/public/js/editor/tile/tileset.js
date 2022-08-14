export default class Tileset extends Editor.ListenerGroup {

  #mouseListener;
  #hiliteGroup;
  #marker;
  #image;

  //
  #active = false;
  #cells = new Set( );

  constructor( ) {
    super( );
  }

  async init(html) {
    this.#mouseListener = html.querySelector('#listener');
    this.#hiliteGroup = html.querySelector('#hilite');
    this.#marker = html.querySelector('#marker')
    this.bindElement(this.#mouseListener, 'mousedown', this.#handleMouse.bind(this));
    this.bindElement(this.#mouseListener, 'mousemove', this.#handleMouse.bind(this));
    this.bindElement(this.#mouseListener, 'mouseover', this.#handleMouse.bind(this));
    this.bindElement(this.#mouseListener, 'mouseout', this.#handleMouse.bind(this));
    this.bindElement(this.#mouseListener, 'mouseup', this.#handleMouse.bind(this));
    this.#image = await System.load.loadImage('/assets/stages/tiles.webp', document.getElementById('tileset'));
    this.#onMouseOut( );
  }

  get image( ) {
    return this.#image
  }

  //
  #createRect(coord) {
    return System.dom.createSVG(
      'rect', {x: coord[0], y: coord[1], width: System.TILESIZE, height: System.TILESIZE}
    );
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

  #hiliteCell(coord) {
    const rect = this.#createRect(coord);
    this.#hiliteGroup.append(rect);
  }

  #hiliteClear( ) {
    this.#cells.clear( );
    while(this.#hiliteGroup.firstChild)
      this.#hiliteGroup.removeChild(this.#hiliteGroup.firstChild);
  }

  #moveMarker(position) {
    this.#marker.setAttribute('x', position.coord[0]);
    this.#marker.setAttribute('y', position.coord[1]);
  }

  #onMouseDown(position) {
    this.#active = true;
    this.#hiliteClear( );
    this.#setHilite(position);
  }

  #onMouseUp(position) {
    this.#active = false;
    document.dispatchEvent(new CustomEvent('tileselection', {detail: {position: position, cells: [...this.#cells]}}))
  }

  #onMouseMove(position) {
    this.#moveMarker(position);
    if(this.#active) this.#setHilite(position);
  }

  #onMouseOver(position) {
    this.#marker.style.visibility = "visible";
  }

  #onMouseOut(position) {
    this.#marker.style.visibility = 'hidden';
  }

  #setHilite(position) {
    let value = position.grid.join(':');
    if(!this.#cells.has(value)) {
      this.#cells.add(value);
      this.#hiliteCell(position.coord);
    }
  }

}
