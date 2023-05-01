/** ========================================================================
 * Rumbler
 * -------
 * Base class of all fighting character objects within the gamespace
 ==========================================================================*/
 class Rumbler extends ActionObject {
    
    constructor(config) {
        super(config);
        this.#setHooks( );
    }

    #setHooks( ) {
        this.setHook('ground', this.#onGround.bind(this));
        this.setHook('aerial', this.#inAir.bind(this));
    }

    #onGround(config) {
        if(this.velocity.x != 0) this.velocity.x *= FRICTION * config.seconds; 
        if(Math.abs(this.velocity.x) < FRICTION) this.velocity.x = 0;
    }

    #inAir(config) {
        this.velocity.y += config.seconds * GRAVITY;
    }

    update(config) {
        this.move(config.seconds);
        if(this.bottom >= GROUND) this.signal('ground', config);
        else this.signal('aerial', config);
    }

    serialize( ) {
        return Object.assign(ActionObject.prototype.serialize.call(this), { });
    }

}

/** ========================================================================
 * Dummy
 * -------
 * Testing Object simulating a basic Action Object
 ==========================================================================*/
class Dummy extends ActionObject {
    
    constructor(width, height){
        super({width: width, height: height});
        this.#setHooks( );
    }

    #setHooks( ) {
        this.setHook('left', this.#left.bind(this));
        this.setHook('right', this.#right.bind(this));
        this.setHook('up', this.#up.bind(this));
        this.setHook('down', this.#down.bind(this));
    }

    #left(options) {
        this.velocity.x = -5 * options.seconds;
    }

    #right(options) {
        this.velocity.x =  5 * options.seconds;
    }

    #up(options) {
        this.velocity.y = -5 * options.seconds;
    }

    #down(options) {
        this.velocity.y = +5 * options.seconds;
    }

    update(options) {
       this.velocity.set([0, 0, 0]);
    }

}

/** ========================================================================
 * DummyRumbler
 * -------
 * Testing Object simulating a basic Rumbler Object
 ==========================================================================*/
 class DummyRumbler extends Rumbler {

    constructor(config) {
        super(config);
    }

 }
