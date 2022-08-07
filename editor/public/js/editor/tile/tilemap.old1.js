import TileLayer from './tilelayer.js';

export default class Tilemap {

  constructor(name = "Untitiled") {
    this.data = {
      map: {
        collision: new TileLayer(System.MAP_ROWS, System.MAP_COLUMNS),
        layers: [null, null, null].map( x => x = new TileLayer(System.MAP_ROWS, System.MAP_COLUMNS))
      },
      meta: {
        name: name,
        background: [0, 0, 0, 1],
        skybox: null,
        spawnPoints: {
          player: [
            {row: 0, col: 0}
          ],
          non_player: [
            {row: 0, col: 0}
          ],
          placed_objects: { }
        }
      }
    }
    this.selectLayer('layer:2');
  }

  get name( ) {
    return this.data.meta.name;
  }

  set name(n) {
    this.data.meta.name = n;
  }

  selectLayer(id) {
    const name = id.split(":");
    if(name[0] == 'collision') this.current = {name: 'collision', layer: this.data.map.collision};
    else if( name.length > 1 || name[0] == 'layer') this.current = {name: id, layer: this.data.map.layers[name[1]]};
  }

  pack( ) {
    let pkg = Object.assign({ }, this.data);
    pkg.map.collision = this.data.map.collision.pack( );
    pkg.map.layers = this.data.map.layers.map( x => x.pack( ));
    return pkg
  }

  async unpack(data) {
    Object.assign(this.data.meta, data.meta);
    await this.data.map.collision.unpack(data.map.collision);
    for(let i = 0; i < 3; i++ ) await this.data.map.layers[i].unpack(data.map.layers[i]);
  }

}
