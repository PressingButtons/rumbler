export class MapRender {

  #listeners = new Editor.ListenerGroup( );
  #shaders;
  #gl;

  constructor( ) {

  }

  async init(gl) {
    this.#gl = gl;
    this.#shaders = await Arachnid.compileWebGL()
    this.#listeners.bindElement(document, 'drawmap', this.#onDrawMap.bind(this));
  }

  //private
  #onDrawMap(event) {
    
  }

}
