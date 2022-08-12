import TileEditor from './editor/tile/tilemain.js'

window.onload = async event => {
  document.addEventListener('pageloaded', onPageLoad);
}

const onPageLoad = event => {
  if(Editor.current) Editor.current.shutdown( );
  switch(event.detail) {
    case 'tile': Editor.current = new TileEditor(document.querySelector('.wrapper')); break;
  }
  Editor.current.init( );
}
