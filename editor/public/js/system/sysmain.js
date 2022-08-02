import {loadImage} from './loadimage.js';
import {loadPage} from './loadpage.js';
import {loadForm} from './loadform.js';

Object.defineProperty(window, "System", {
  value: {
    loadImage: loadImage,
    loadPage: loadPage,
    loadForm: loadForm
  }
});
