export default class WarriorActionProgram extends Arachnid.State {
  constructor(host) {
    super('wap')
    this.linkState(new Nuetral(host), new Attack(host), true);
    this.linkState(this.childStates.nuetral, new Hurt(host), true);
    this.linkState(this.childStates.attack), this.childStates.hurt, true);
  }
}

class Nuetral extends Arachnid.State {
  constructor(host) {
    super('nuetral', host);
  }
}

class Attack extends Arachnid.State {
  constructor(host) {
    super('nuetral', host);
  }
}

class Hurt extends Arachnid.State {
  constructor(host) {
    super('nuetral', host);
  }
}
