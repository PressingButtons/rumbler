import TileEditor from './tile/tileeditor.js';


class App extends EventTarget {

  constructor( ) {
    super( );
    this.editor;
  }

  async loadEditor(type) {
    await System.ajax.getPage(type);
    loadEditor[type]( );
  }

}

const loadEditor = { };

loadEditor.tile = async function( ) {
  this.editor = new TileEditor( );
  await this.editor.init( );
}

export default new App( );
