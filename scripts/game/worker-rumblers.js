/** ========================================================================
 * Rumbler
 * -------
 * Base class of all fighting character objects within the gamespace
 ==========================================================================*/
 class Rumbler extends ActionObject {
    
    constructor(config) {
        super(config);
        this.#setHooks( );
        this.buttons = null;
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
    
    static SPEED = 40;

    constructor(width, height){
        super({width: width, height: height});
        this.#setHooks( );
        this.buttons = null;
    }

    #setHooks( ) {
        this.setHook('left', this.#left.bind(this));
        this.setHook('right', this.#right.bind(this));
        this.setHook('up', this.#up.bind(this));
        this.setHook('down', this.#down.bind(this));
    }

    #left(options) {
        this.velocity.x = -Dummy.SPEED;

    }

    #right(options) {
        this.velocity.x =  Dummy.SPEED;
    }

    #up(options) {
        this.velocity.y = -Dummy.SPEED;
    }

    #down(options) {
        this.velocity.y =  Dummy.SPEED;
    }

    update(options) {
       this.velocity.set([0, 0, 0]);
    }

    clearButtons( ) {
        this.buttons.set([0, 0, 0, 0, 0, 0, 0, 0]);
    }

    update(config) {
        this.velocity.set([0, 0, 0]);
        if(this.buttons.up)     this.#up(config)
        if(this.buttons.left)   this.#left(config)
        if(this.buttons.down)   this.#down(config)
        if(this.buttons.right)  this.#right(config)
        this.move(config.seconds);
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
