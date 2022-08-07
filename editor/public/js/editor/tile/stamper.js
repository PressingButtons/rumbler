export default class Stamper extends EventTarget {

  #values;
  #stamper;

  constructor(stamper) {
    super( );
    this.#stamper = stamper;
    this.#stamper.setAttribute('stroke', 'red');
    this.clear( );
  }

  clear( ) {
    this.#values = null;
    this.#stamper.setAttribute('width', 16);
    this.#stamper.setAttribute('height', 16);
  }

  drawTile(image, cells) {
    const rect = System.calc.tileCrop(cells);
    this.#stamper.width = rect.width;
    this.#stamper.height = rect.height;
    this.#stamper.querySelector('canvas').ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
  }

  hide( ) {
    this.#stamper.style.visibility = 'hidden';
  }

  move(position) {
    this.#stamper.setAttribute('y', position.row * System.TILESIZE);
    this.#stamper.setAttribute('x', position.col * System.TILESIZE);
  }

  show( ) {
    this.#stamper.style.visibility = 'visible'
  }

  setValues(image, values) {
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
    const rect = System.calc.tileCrop(values);
    resizeStamp(this.#stamper, rect);
    drawValues(this.#stamper.querySelector('canvas').getContext('2d'), image, values, rect);
  }

  //
  get values( ) {
    return this.#values;
  }
}

function drawValues(ctx, image, values, rect) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for(const index in values) drawTile(ctx, image, index, rect);
}

function drawTile(ctx, image, value, rect) {
  const tile = System.calc.tileRect(value);
  ctx.drawImage(image, tile.x, tile.y, tile.width, tile.height, tile.x - rect.x, tile.y - rect.y, tile.width, tile.height);
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

function resizeStamp(stamp, rect) {
  stamper.setAttribute('width', rect.width);
  stamper.setAttribute('height', rect.height);
}
