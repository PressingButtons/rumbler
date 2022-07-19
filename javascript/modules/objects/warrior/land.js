export default class Land extends Arachnid.State {

  constructor(host) {
    super('land', host);

  }

  enterState( ) {
    this.signal(this.host.currentStatus);
    this.host.setFlag('land', true);
  }

  exitState( ) {
  }

  onUpdate( ) {
    if(!this.host.getFlag('land'))
      this.host.signal(this.host.childStates.air);
  }

}
