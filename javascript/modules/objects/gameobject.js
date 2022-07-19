export default class GameObject extends Arachnid.State {

  static NUM_INSTANCES = 0;

  constructor(config) {
    super(config.name || "gameobject" + GameObject.NUM_INSTANCES);
    GameObject.NUM_INSTANCES ++;
  }

}
