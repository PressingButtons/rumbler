import TileEditor from '../editor/tile/tileeditor.js';

export async function loadEditor(type) {
  await System.loadPage(type);
  setEditor[type]( );
}


const setEditor = { };


setEditor.tile = async function( ) {
  System.Editor = new TileEditor();
  await System.Editor.init(
    document.getElementById('stamper'),
    document.querySelector('.tileset svg'),
    document.querySelector('.tilemap')
  );
}
