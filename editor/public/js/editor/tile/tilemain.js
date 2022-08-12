import Tileset from './tileset.js';
import Tilemap from './tilemap.js';

export default class TileEditor  {

  constructor( html ) {
    this.#init(html)
  }

  #init(html) {
    this.tileset = new Tileset(html.querySelector('.tileset'));
    this.tilemap = new Tilemap(html.querySelector('.tilemap'));
  }

  shutdown( ) {
    this.tileset.shutdown( );
    this.tilemap.shutdown( );
  }

}
