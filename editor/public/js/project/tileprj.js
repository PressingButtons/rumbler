export default class TileProject extends EventTarget {

  static WIDTH = 1028;
  static HEIGHT = 720;

  #config;

  constructor(name, config = null) {
    super( );
    if(config) this.#config = config;
    else {
      this.#config = {
        collision: new Array(TileProject.WIDTH * TileProject.HEIGHT),
        layer: new Array(3),
        backgroundColor: [0, 0, 0, 1],
        skybox: null,
        name: name
      }
      this.data.collision.fill(0);
      for(let layer of this.data.layer) {
        const ar = new Array(TileProject.WIDTH * TileProject.HEIGHT);
        layer = ar;
      }
    }
  }

  plotCollisionTile(row, column, value) {
    const index = row * TileProject.WIDTH + column;
    this.#config.collision[index] = value
    this.dispatchEvent(new Event('update'));
  }

  plotGraphicTile(layerIndex, row, column, value) {
    const index = row * TileProject.WIDTH + column;
    this.#config.layer[layerIndex][index] = value
    this.dispatchEvent(new Event('update'));
  }

  setBackgroundColor(color) {
    this.#config.backgroundColor = color;
  }

  setSkyBox(url) {
    this.#config.skybox = url
  }

  get data( ) {
    return this.#config;
  }

}
