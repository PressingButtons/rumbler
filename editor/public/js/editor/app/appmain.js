import * as load from './load.js'
import Tilelib from './tile/tilelib.js';

Object.defineProperty(window, 'App', {value: { }});
App.Editor = null;

Object.defineProperties(App, {
  load: {value: load},
  Tiles: {value: Tilelib}
});
