import App from './editor/editorapp.js'
window.onload = async event => {
  await App.loadEditor('tile');
}
