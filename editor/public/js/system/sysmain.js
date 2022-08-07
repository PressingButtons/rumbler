import * as ajax from './ajax.js';
import * as calc from './calc.js';
import * as dom  from './dom.js';
import ContentFile from './contentfile.js';
import {sendError} from './error.js'
import {loadImage} from './loadimage.js';

Object.defineProperty(window, "System", {
  value: {
    ajax: ajax,
    calc: calc,
    dom: dom,
    loadImage: loadImage,
    ContentFile: ContentFile,
    sendError: sendError,
    Editor: null,
    TILESIZE: 16, PIXEL_LENGTH: 4, MAP_COLUMNS: 80, MAP_ROWS: 45
  }
});
