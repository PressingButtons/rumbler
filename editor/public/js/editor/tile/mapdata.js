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
        collision: new MapLayer(name, 0),
        layers: [null, null, null].map( x => x = new MapLayer(name, 1))
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
    this.addFile(this.data[name].collision);
    this.addFile(this.data[name].layers[0]);
    this.addFile(this.data[name].layers[1]);
    this.addFile(this.data[name].layers[2]);
  }

  //private
}
