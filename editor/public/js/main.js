import './editor/app/appmain.js'
window.onload = async event => {
  await App.load.loadEditor('tile');
}
