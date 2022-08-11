import * as ajax   from './ajax.js';
import * as dom    from './dom.js';
import * as error  from './error.js';
import * as loader from './loader.js';
import * as mouse  from './mouse.js';
import * as parse  from './parse.js';
import * as assetLoader from './assetloader.js';
import DataFile from './datafile.js';

Object.defineProperty(window, 'System', {value: { }});

Object.defineProperties(System, {
  ajax:   {value: ajax},
  dom:    {value: dom},
  error:  {value: error},
  load:   {value: loader},
  mouse:  {value: mouse},
  parse:  {value: parse},
  assetLoader: {value: assetLoader},
  DataFile: {value: DataFile},
  PIXEL_LENGTH: {value: 4},
  TILESIZE: {value: 16},
  MAP_COLUMNS: {value: 80},
  MAP_ROWS: {value: 45},
  MAP_WIDTH:  { get( ) {return System.MAP_COLUMNS * System.TILESIZE}},
  MAP_HEIGHT: { get( ) {return System.MAP_ROWS * System.TILESIZE}}
});
