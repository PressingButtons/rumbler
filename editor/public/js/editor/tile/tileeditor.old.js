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
    this.tileselector = new TileSelector(tileselctorSVG);
    this.mapeditor.addEventListener('stamp', this.#onStamp.bind(this));
    this.tileselector.addEventListener('tileselection', this.#onTileSelection.bind(this));
    console.log('loading config')
    this.#data = await System.getJSON('/assets/stages/config.json');
    this.refreshTiles( );
    this.create( );
    this.save( );
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
    this.#data[this.tilemap.name] = this.tilemap.pack( );
    return System.upload('/stages', JSON.stringify(this.#data), 'application/json')
    .catch(err => System.sendError(err, 'Failure to save tile data.'));
  }

  async refreshTiles( ) {
    return System.loadImage('/assets/stages/tiles.webp', document.getElementById('tileset'));
  }

  rename(name) {
    if(!this.tilemap) return;
    this.#data[name] = this.tilemap.name;
    delete this.#data[this.tilemap.name];
    this.tilemap.name = name;
  }

  //private
  #onStamp(event) {
    this.tilemap.current.plotGroup(event.detail);
  }

  #onTileSelection(event) {
    this.mapeditor.setStampData(TileEditor.tileset, event.detail);
  }

  static get tileset( ) {
    return document.getElementById('tileset');
  }

}
