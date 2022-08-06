import MapEditor from './mapeditor.js'
import TileSelector from './tileselector.js';
import Tilemap from './tilemap.js'

export default class TileEditor extends EventTarget {

  #data;

  constructor( ) {
    super( );
  }

  async init(tileselctorSVG, tilemapContainer) {
    this.mapeditor = new MapEditor(tilemapContainer);
    //this.mapeditor.addEventListener('tileselection', this.#onTileSelection.bind(this));
    this.tileselector = new TileSelector(tileselctorSVG);
    this.tileselector.addEventListener('tileselection', this.#onTileSelection.bind(this));
    this.#data = await System.getJSON('/data/stages.json');
    this.refreshTiles( );
  }

  create(name) {
    this.tilemap = new Tilemap(name);
  }

  load(name) {
    create(null);
    this.tilemap.importData(this.#data[name]);
  }

  delete(name) {
    delete this.#data[name];
  }

  save( ) {
    if(!this.tilemap) throw 'Invalid operation, no active Tilemap Object to save.';
    this.#data[this.tilemap.name] = this.tilemap.getData( );
    return System.saveToLocalFile('/data/stages.json', JSON.stringify(this.#data))
    .catch(err => System.sendError(err, 'Failure to save tile data.'));
  }

  async refreshTiles( ) {
    return System.loadImage('/images/tiles', document.getElementById('tileset'));
  }

  rename(name) {
    if(!this.tilemap) return;
    this.#data[name] = this.tilemap.name;
    delete this.#data[this.tilemap.name];
    this.tilemap.name = name;
  }

  //private

  #onTileSelection(event) {
    this.mapeditor.setStampData(TileEditor.tileset, event.detail);
  }

  #onTilemapUpdate(event) {

  }

  //
  static get tileset( ) {
    return document.getElementById('tileset');
  }

}
