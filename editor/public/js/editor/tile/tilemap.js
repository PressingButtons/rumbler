export default class Tilemap {

  static WIDTH = 1280;
  static HEIGHT = 720;
  static COLUMNS = 80;
  static ROWS = 45;

  #data;

  constructor(name = "Untitled") {
    this.#data = {
      collision: createTilemapLayout( ),
      layers: [createTilemapLayout( ), createTilemapLayout( ), createTilemapLayout( )],
      backgroundColor: [0, 0, 0, 1],
      skybox: null,
      name: name
    };
  }

  get collisionMap( ) {
    return this.#data.collision;
  }

  get name( ) {
    return this.#data.name;
  }

  set name(n) {
    this.#data.name = n;
  }

  layer(n = 0) {
    return this.#data.layers[n];
  }

  getData( ) {
    const data = packData(this.#data);
    return data;
  }

  setSkyboxURL(url) {
    this.#data.skybox = url;
  }

  setBackgroundColor(r = 0, g = 0, b = 0, a = 1) {
    this.#data.backgroundColor[0] = r;
    this.#data.backgroundColor[1] = g;
    this.#data.backgroundColor[2] = b;
    this.#data.backgroundColor[3] = a;
  }

  importData(data) {
    this.setSkyboxURL(data.skybox);
    this.setBackgroundColor(...data.backgroundColor);
    unPackLayer(this.#data.collision, data.collision);
    unPackLayer(this.#data.layers[0], data.layers[0]);
    unPackLayer(this.#data.layers[1], data.layers[1]);
    unPackLayer(this.#data.layers[2], data.layers[2]);
    this.#data.name = data.name;
  }

}

function createTilemapLayout( ) {
  const layer = new Array(Tilemap.ROWS).fill(new Array(Tilemap.COLUMNS).fill(0));
  return layer;
}

function packData(data) {
  return {
    collision: packArray(data.collision),
    layers: data.layers.map(x => packArray(x)),
    backgroundColor: data.backgroundColor,
    skybox: data.skybox,
    name: data.name
  }
}

function packArray(array) {
  let byteArray = array.map(x => x.join(''));
  return byteArray.join('.');
}

function unPackLayer(layer, value) {
  layer = unpackString(value);
}

function unpackString(str) {
  let byteArray = str.split('.');
  const layout = createTilemapLayout( );
  for(let i = 0; i < layout.length; i++)
    for(let j = 0; j < layout[i].length; j++)
      layout[i][j] = parseInt(byteArray[i][j]);
  return layout;
}
