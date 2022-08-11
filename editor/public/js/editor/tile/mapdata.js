import MapLayer from './maplayer.js';

export default class MapData extends System.ContentFile {

  constructor(name) {
    super('/assets/stages/config.json', System.ContentFile.JSON);
  }
  //public
  init( ) {
    return this.load( );
  }

  addStage(name) {
    //stage
    this.data[name] = {
      map: {
        collision: new MapLayer(name, 'collision'),
        layer0: new MapLayer(name, 'collision'),
        layer1: new MapLayer(name, 'collision'),
        layer2: new MapLayer(name, 'collision')
      },
      meta: {
        name: name,
        skybox: null,
        background: [0, 0, 0, 1],
        spawnPoints: {
          objects: { },
          player: [{row: 0, col: 0}],
          non_player: [{row: 0, col: 0}]
        }
      }
    }
    this.addFile(this.data[name].map.collision);
    this.addFile(this.data[name].map.layer0);
    this.addFile(this.data[name].map.layer1);
    this.addFile(this.data[name].map.layer2);
    this.data[name].map.collision.addEventListener('update', this.#onCollisionUpdate.bind(this));
    this.data[name].map.layer0.addEventListener('update', this.#onLayerUpdate.bind(this));
    this.data[name].map.layer1.addEventListener('update', this.#onLayerUpdate.bind(this));
    this.data[name].map.layer2.addEventListener('update', this.#onLayerUpdate.bind(this));
    this.#setOuterCollisionRing(this.data[name].map.collision);
    this.current = this.data[name];
    this.selectLayer('layer0');
  }

  drawCurrent( ) {
    this.dispatchEvent(new CustomEvent('drawmap', {detail: this.current}));
  }

  selectLayer(layer) {
    this.currentLayer = this.current.map[layer];
  }

  update(detail) {
    this.currentLayer.plot(detail);
  }

  //private
  #onCollisionUpdate(event) {
    this.#setOuterCollisionRing( );
    if(!event.detail) return this.drawCurrent( );
    this.dispatchEvent(new CustomEvent('update', {detail: this.collision.map}));
  }

  #onLayerUpdate(event) {
    if(!event.detail) return this.drawCurrent( );
    this.dispatchEvent(new CustomEvent('update', {detail: event.target}));
  }


  #setOuterCollisionRing(collision) {
    collision.map.fillStyle = '#001300';
    collision.map.fillRect(0, 0, System.MAP_COLUMNS, System.MAP_ROWS);
    collision.map.clearRect(1, 1, System.MAP_COLUMNS - 2, System.MAP_ROWS - 2);
  }
}
