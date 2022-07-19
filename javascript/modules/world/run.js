export default class WorldRun extends Arachnid.State {

  #lastStep;
  #step;
  #norepeat = false;

  constructor(world) {
    super('world_run', world);
  }

  #updateWorld(timestamp) {
    const dt = timestamp - this.#lastStep;
    this.#lastStep = timestamp;
    //update data
    this.host.update(dt);
    //loop bool
    if(!this.#norepeat)
    this.#step = requestAnimationFrame(this.#updateWorld.bind(this));
  }

  enterState( ) {
    this.#lastStep = performance.now( );
    //updates
    this.#norepeat = false;
    this.#step = requestAnimationFrame(this.#updateWorld.bind(this));
  }

  exitState( ) {
    this.#norepeat = true;
    cancelAnimationFrame(this.#step);
  }

  onUpdate( ) {

  }

}
