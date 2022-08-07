export default class MapLayer extends System.ContentFile {

  #type;

  constructor(name, type) {
    this.#type = type == 0 ? 'collision' : 'graphic';
    super(`/assets/stages/maps/${name}/${this.#type}.webp`, System.ContentFile.IMAGE);
    this.#init( );
  }

  #init( ) {
    const width = System.MAP_COLUMNS * System.TILESIZE;
    const height = System.MAP_ROWS   * System.TILESIZE;
    this.data = System.createContext2D(width, height);
  }

}
