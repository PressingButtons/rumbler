import {loadImage} from './loadimage.js';
import {loadPage} from './loadpage.js';
import {loadForm} from './loadform.js';
import {loadEditor} from './loadeditor.js';
import {getJSON} from './ajax.js';
import {createContext2D, createSVG} from './dom.js';
import {sendError} from './error.js';
import {saveToLocalFile} from './savetolocal.js';
import * as Calc from './calc.js';

Object.defineProperty(window, "System", {
  value: {
    getJSON: getJSON,
    loadImage: loadImage,
    loadPage: loadPage,
    loadForm: loadForm,
    loadEditor: loadEditor,
    saveToLocalFile: saveToLocalFile,
    createContext2D: createContext2D,
    Calc: Calc,
    createSVG: createSVG,
    sendError: sendError,
    project: null,
    Editor: null,
    TILESIZE: 16
  }
});
