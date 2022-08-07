import TileEditor from '../editor/tile/tileeditor.js';

export default async function loadEditor(type) {
  await System.loadPage(type);
  setEditor[type]( );
}

const setEditor = { };

setEditor.tile = async function( ) {
  System.Editor = new TileEditor();
  await System.Editor.init( );
}
