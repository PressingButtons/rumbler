export default class Stamper extends EventTarget {

  #values;
  #stamper;

  constructor(stamper) {
    super( );
    this.#stamper = stamper;
  }

  clear( ) {
    this.#values = null;
    this.#stamper.width = 16;
    this.#stamper.height = 16;
  }

  drawTile(image, cells) {
    const rect = System.calc.tileCrop(cells);
    this.stamper.width = rect.width;
    this.stamper.height = rect.height;
    this.stamper.ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
  }

  hide( ) {
    this.#stamper.style.visibility = 'hidden';
  }

  move(position) {
    this.#stamper.css.top = postion.row * System.TILESIZE;
    this.#stamper.css.left = position.col * System.TILESIZE;
  }

  show( ) {
    this.#stamper.style.visibility = 'visible'
  }

  setValues(values, image) {
    this.#values = values;
    this.#cropImage(values, image);
  }

  stamp(map, position) {
    if(!this.#values || !this.#stamper.style.visible) return;
    for(let i = 0; i < values.length; i++) {
      for(let j = 0; j < values[i].length; j++) {
        map[position.row + i] = values[i][j];
      }
    }
    document.dispatchEvent(new Event('stamped'));
  }

  /// private methods

  #cropImage(values, image) {
    const rect = getRect(values);
    drawRect(this.#stamper, rect);
  }
}

function drawRect(canvas, rect) {
  const ctx = canvas.getContext('2d');
  canvas.width = rect.x2 - rect.x1;
  canvas.height = rect.y2 - rect.y1;

}

function getRect(values) {
  if(!values) throw 'error - cannot get dimensions for stamp (getRect)'
  return {
    x1: values[0][0] * System.TILESIZE,
    y1: values[0] * System.TILESIZE,
    x2: values[values.length - 1][values[values.length - 1].length - 1] * System.TILESIZE + System.TILESIZE,
    y2: values[values.length - 1] * System.TILESIZE + System.TILESIZE
  }
}
