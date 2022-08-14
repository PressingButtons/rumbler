import Tileset from './tileset.js';
import Tilemap from './tilemap.js';
import MapData from './mapdata.js';
import MapRender from './maprender.js';
import MapView from './mapview.js';

export default class TileEditor extends Editor.ListenerGroup {

  constructor(html) {
    super( );
    this.html = html;
  }

  async init( ) {
    this.tileset = new Tileset( );
    this.tilemap = new Tilemap( );
    this.mapdata = new MapData( );
    this.maprender = new MapRender( );
    this.mapview = new MapView( );
    await this.tilemap.init(this.html.querySelector('.tilemap'));
    await this.tileset.init(this.html.querySelector('.tileset'));
    await this.mapview.init(this.html.querySelector('.mapview'));
    await this.maprender.init(this.tilemap.gl, this.tileset.image);
    await this.mapdata.init(this.tilemap.gl);
    this.bindElement(document, 'keyup', this.#onKeyUp.bind(this));
  }

  shutdown( ) {
    this.tileset.unbindAll( );
    this.tilemap.unbindAll( );
    this.mapdata.unbindAll( );
    this.maprender.unbindAll( );
    this.unbindAll( );
  }

  #onKeyUp(event) {
    const key = event.key.toLowerCase( );
    if(!isNaN(key)) this.#selectLayer(parseInt(key));
  }

  #selectLayer(num) {
    if(num > -1 && num < 5) this.mapdata.selectLayer(num)
  }

}
