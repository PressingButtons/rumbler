import * as TileInterface from './t_interface.js';
import * as MapObject from './t_mapdata.js';

let lib;

export default class TileEditor {

  constructor( ) {
    lib = App.Tiles;
    this.mapid = [0, 0]
  }

  async init( ) {
    await MapObject.init( );
    await TileInterface.init( );
    document.addEventListener('stamp', this.#onStamp.bind(this));
  }

  #initUI(ui) {
    this.ui = ui;
    return ui.init( );
  }

  #onCollisionUpdate(event) {

  }

  #onDrawMap(event) {
    //this.ui.editor.drawMap(event.detail);
  }


  #onStamp(event) {
    if(event.detail.values == undefined) return;
    const data = { };
    const range = lib.calc.tileRange(event.detail.values);
    const offset = lib.calc.pointToGrid(range.splice(0, 2));
    for(const value of event.detail.values) this.#setValue(data, event.detail.position.grid, offset, value);
    document.dispatchEvent(new CustomEvent('stampmap', {detail: {data: data, id: this.mapid}}));
  }


  #onUpdate(event) {
    ///this.ui.editor.drawPlot(event.target, event.detail);
  }

  #setListeners( ) {
    //this.ui.editor.addEventListener('stamp', this.#onStamp.bind(this));
  }

  #setValue(group, origin, offset, value) {
    value = value.split(':').map( x => parseInt(x));
    let row = value[0] - offset[0] + origin[0];
    let col = value[1] - offset[1] + origin[1];
    group[row + ":" + col] = value;
  }

}
