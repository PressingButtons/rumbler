export default class MapRender extends Editor.ListenerGroup {

  #shader;
  #gl;
  #transform;
  #projection;
  #buffer;
  #tileTexture = new Arachnid.Texture( );
  #mapTexture = new Arachnid.Texture( );
  #ctx;

  constructor( ) {
    super( );
    this.#transform = glMatrix.mat4.create( );
  }

  async init(gl, tiles) {
    this.#gl = gl;
    this.#shader = await Arachnid.compileWebGL(gl, '/shaders/config.json').then( x => x.tiles );
    this.#ctx = System.dom.createContext('2d', System.MAP_COLUMNS, System.MAP_ROWS);
    this.#tileTexture.useImage(gl, tiles);
    this.bindElement(document, 'drawmap', this.#onDrawMap.bind(this));
    this.#buffer = this.#createBuffer( );
    System.glRender.setShader(gl, this.#shader);
  }

  #createBuffer( ) {
    const w = System.MAP_WIDTH;
    const h = System.MAP_HEIGHT;
    return System.glRender.createBuffer(this.#gl, new Float32Array([
      0, 0, 0, 0,
      1, 0, 1, 0,
      0, 1, 0, 1,
      0, 1, 0, 1,
      1, 1, 1, 1,
      1, 0, 1, 0
    ]));
  }

  #cropSource(data, i) {
    this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);
    this.#ctx.drawImage(data.src, data.coord[0], i * System.MAP_ROWS, System.MAP_COLUMNS, System.MAP_ROWS, 0, 0, System.MAP_COLUMNS, System.MAP_ROWS);
    return this.#ctx.canvas;
  }

  #drawLayer(data, i) {
    const tintc = Math.min(0.70 + 0.15 * i, 1);
    const tint = [tintc, tintc, tintc, 1]
    const source = this.#cropSource(event.detail, i);
    this.#mapTexture.useImage(this.#gl, source);
    this.#gl.viewport( 0, 0, System.MAP_WIDTH, System.MAP_HEIGHT);
    this.#projection = glMatrix.mat4.ortho(glMatrix.mat4.create( ), 0, System.MAP_WIDTH, System.MAP_HEIGHT, 0, 1, -1);
    this.#transform = glMatrix.mat4.fromRotationTranslationScale(glMatrix.mat4.create( ), [0, 0, 0,0], [0, 0, 0, 0], [1280, 720, 1]);
    System.glRender.drawTilemap(this.#gl, this.#shader, this.#buffer, this.#tileTexture, this.#mapTexture,  this.#transform, this.#projection, tint);
  }

  #onDrawMap(event) {
    System.glRender.colorFill(this.#gl, [0, 0, 0, 0]);
    for(let i = 0; i < 4; i++)
      this.#drawLayer(event.detail, i);
  }



}
