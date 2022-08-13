export default class MapRender extends Editor.ListenerGroup {

  #shader;
  #gl;
  #transform;
  #projection;
  #buffer;

  constructor( ) {
    super( );
    this.#transform = glMatrix.mat4.create( );
    this.#projection = glMatrix.mat4.ortho(glMatrix.mat4.create( ), 0, System.MAP_WIDTH, System.MAP_HEIGHT, 0, 1, -1);
  }

  async init(gl) {
    this.#gl = gl;
    this.#shader = await Arachnid.compileWebGL(gl, '/shaders/config.json').then( x => x.tiles );
    this.bindElement(document, 'drawmap', this.#onDrawMap.bind(this));
    this.#buffer = this.#createBuffer( );
    gl.useProgram(this.#shader.program);
  }

  #createBuffer( ) {
    const w = System.MAP_WIDTH;
    const h = System.MAP_HEIGHT;
    return System.glRender.createBuffer(this.#gl, new Float32Array([0, 0, w, 0, 0, h, 0, h, w, h, w, 0]));
  }

  #onDrawMap(event) {
    System.glRender.colorFill(this.#gl, [1.0, 0.5, 0.3, 1.0]);
    //System.glRender.drawTilemap(this.#gl, this.#shader, this.#buffer, event.detail.tiles, event.detail.map, this.#transform, this.#projection);
  }



}
