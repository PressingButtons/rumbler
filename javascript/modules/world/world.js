import WorldRun from './run.js';
import WorldStop from './stop.js';

export default class World extends Arachnid.State {

  #objects;

  constructor(config) {
    super(config.name);
    this.linkState(new WorldRun(this), new WorldStop(this), true);
    this.switchState(this.states.world_stop);
  }

  get objects( ) {
    return this.#objects;
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
