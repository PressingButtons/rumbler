import MapEditor from './mapeditor.js';
import TileSelector from './tileselector.js'

export default class TileUI extends EventTarget {

  constructor( ) {
    super( );
  }

  init( ) {
    this.editor = new MapEditor(document.querySelector('.tilemap'));
    this.ts     = new TileSelector(document.querySelector('.tileset svg'));
    this.ts.addEventListener('tileselection', this.editor.onSelection.bind(this.editor));
  }


}
