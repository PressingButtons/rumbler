import * as ajax from './ajax.js';
import * as calc from './calc.js';
import * as dom  from './dom.js';
import ContentFile from './contentfile.js';
import {sendError} from './error.js'
import * as load from './loadimage.js';

Object.defineProperty(window, "System", {
  value: {
    ajax: ajax,
    calc: calc,
    dom: dom,
    load: load,
    ContentFile: ContentFile,
    sendError: sendError,
    Editor: null,
    get MAP_WIDTH( ) {return System.TILESIZE * System.MAP_COLUMNS},
    get MAP_HEIGHT( ) {return System.TILESIZE * System.MAP_ROWS}
  }
});
