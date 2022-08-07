import MapData from './mapdata.js';
import TileUI from './tileui.js';

export default class TileEditor {

  constructor( ) {

  }

  async init( ) {
    await this.#initData(new MapData( ));
    await this.#initUI(new TileUI( ));
  }

  #initData(data) {
    this.mapdata = data;
    return this.mapdata.init( );
  }

  #initUI(ui) {
    this.ui = ui;
    ui.init( );
  }

}
