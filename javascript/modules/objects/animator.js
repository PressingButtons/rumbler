export default class Animator {

  #config;
  #currentAnimation;
  #currentFrame;
  #currentIndex;
  #cellInterval;

  constructor(config) {
    this.#config = config;
    this.#currentFrame = {cell: this.#config.cells[0], duration: 0};
    this.#currentIndex = 0;
    this.#cellInterval = 0;
  }

  get currentFrame( ) {
    return this.#currentFrame;
  }

  #nextFrame( ) {
    this.#cellInterval = 0;
    this.#currentIndex ++;
    if(this.#currentIndex >= this.#currentAnimation.frames.length)
    this.#currentIndex = 0;
  }

  #zeroFrame( ) {
    this.#currentFrame = {cell: this.#config.cells[0], duration: 0};
  }

  animate(name) {
    if(this.#currentAnimation.name == name || !this.#config.animations[name]) return;
    this.#currentAnimation = this.#config.animations[name];
    this.#currentIndex = 0;
    this.#cellInterval = 0;
    this.#currentFrame = this.#currentAnimation.frames[this.#currentIndex];
  }

  update(dt) {
    if(!this.#currentAnimation) return this.#zeroFrame( )s;
    this.#cellInterval += dt;
    if(this.#cellInterval > this.#currentFrame.duration)
      this.#nextFrame( );
  }

}
