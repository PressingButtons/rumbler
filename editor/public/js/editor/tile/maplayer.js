export default class MapLayer extends System.ContentFile {

  #type;

  constructor(name, id) {
    super(`/assets/stages/maps/${name}_${id}.webp`, System.ContentFile.IMAGE);
    this.id = id;
    this.#init( );
  }

  #init( ) {
    this.map = System.dom.createContext2D(System.MAP_COLUMNS, System.MAP_ROWS);
  }

  get idata( ) {
    return this.map.getImageData(0, 0, System.MAP_COLUMNS, System.MAP_ROWS);
  }

  plot(values) {
    for(const coord in values) this.#plotTile(coord, values[coord]);
    this.dispatchEvent(new CustomEvent('update', {detail: values}));
  }

  setMap(map) {
    this.map.drawImage(map, 0, 0);
    this.dispatchEvent(new Event('update'));
  }

  //private
  #plotTile(coord, value) {
    coord = System.calc.convertToIndex(coord);
    value = value.split(':').map( x => parseInt(x));
    this.data.set(coord, value);
  }


}
