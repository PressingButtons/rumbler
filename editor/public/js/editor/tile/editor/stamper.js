export default class Stamper extends EventTarget {

  #values;
  #stamper;

  constructor(stamper) {
    super( );
    this.#stamper = stamper;
    this.init( );
  }

  get tilesize( ) {
    return App.Tiles.TILESIZE;
  }

  init( ) {
    this.#stamper.setAttribute('stroke', 'red');
    this.ctx = System.dom.create2DContext(this.tilesize, this.tilesize, this.#stamper.querySelector('#stamp_image'));
    this.clear( );
  }

  clear( ) {
    this.resize(this.tilesize, this.tilesize);
  }

  drawCells(image, cells) {
    const range = App.Tiles.calc.tileRange(cells.slice( ));
    this.resize(range[2] - range[0], range[3] - range[1]);
    for(const cell of cells) this.drawCell(image, cell, range);
  }

  drawCell(image, cell, range) {
    const coord = App.Tiles.calc.gridToPoint(cell);
    const dest = [coord[0] - range[0], coord[1] - range[1]];
    this.ctx.drawImage(image, coord[0], coord[1], this.tilesize, this.tilesize, dest[0], dest[1], this.tilesize, this.tilesize );
  }

  hide( ) {
    this.#stamper.style.visibility = 'hidden';
  }

  move(position) {
    this.#stamper.style.transform = `translate(${position[0]}px, ${position[1]}px)`
  }

  resize(width, height) {
    [...this.#stamper.querySelectorAll('*')].forEach((x) => {
      x.setAttribute('width', width);
      x.setAttribute('height', height);
    });
    this.ctx.width = width;
    this.ctx.height = height;
  }

  show( ) {
    this.#stamper.style.visibility = 'visible'
  }

}
