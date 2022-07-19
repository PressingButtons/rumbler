import WorldRun from './run.js';
import WorldStop from './stop.js';
import Camera from './camera.js';

export default class World extends Arachnid.State {

  #objects = [];
  #camera = new Camera( );

  constructor(config) {
    super(config.name);
    this.backgroundColor = config.backgroundColor || [0, 0, 0, 1];
    this.background = config.background;
    this.linkState(new WorldRun(this), new WorldStop(this), true);
    this.switchState(this.childStates.world_stop);
  }

  get objects( ) {
    return this.#objects;
  }

  get camera() {
    return this.#camera;
  }

  load( ) {

  }

  run( ) {
    this.signal('world_run');
  }

  stop( ) {
    this.signal('world_stop');
  }

  onUpdate(dt) {
    for(const object of this.#objects) object.update(dt, this);
  }

}
