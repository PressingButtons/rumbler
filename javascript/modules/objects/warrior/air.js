export default class Air extends Arachnid.State {

  constructor(host) {
    super('air', host);
  }

  enterState( ) {
    this.signal(this.host.currentStatus);
    this.host.setFlag('land', false);
  }

  exitState( ) {
  }

  onUpdate( ) {
    if(this.host.getFlag('land'))
      this.host.signal(this.host.childStates.land);
  }

}
