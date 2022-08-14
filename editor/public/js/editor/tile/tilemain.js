import Tileset from './tileset.js';
import Tilemap from './tilemap.js';
import MapData from './mapdata.js';
import MapRender from './maprender.js';
import MapView from './mapview.js';

export default class TileEditor  {

  constructor(html) {
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
    await this.maprender.init(this.tilemap.gl);
    await this.mapdata.init(this.tilemap.gl, this.tilemap.tileset);
  }

  shutdown( ) {
    this.tileset.unbindAll( );
    this.tilemap.unbindAll( );
    this.mapdata.unbindAll( );
    this.maprender.unbindAll( );
  }

}
