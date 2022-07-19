import GameObject from '../gameobject.js';
import Land from './land.js';
import Air from './air.js';
import WAP from './wap.js';

export default class Warrior extends GameObject {

  #wap;

  constructor(config) {
    super(config);
    this.#wap = new WAP(this);
    this.linkState(new Land(this), new Air(this), true);
  }

  get currentStatus( ) {
    return this.#wap.currentState.name;
  }

  signalStatus(s) {
    this.#wap.signal(s);
  }

}
