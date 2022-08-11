import TileEditor from '../tile/editor/t_editor.js';

export async function loadEditor(name) {
  await loadPage(name);
  switch (name) {
    case 'tile': App.Editor = new TileEditor( ); break;
  }
  App.Editor.init( );
}

export async function loadPage(name) {
  const html = await System.ajax.getText('/page/' + name + '.html');
  document.querySelector('.wrapper').innerHTML = html;
}
