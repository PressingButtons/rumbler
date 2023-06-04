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
        this.bottom = GROUND;
        this.velocity.y = 0;
        this.body.width = this.width;
    }

    #inAir(config) {
        this.velocity.y += config.seconds * GRAVITY;
        this.body.width = this.width * 0.5;
    }

    #collideRumbler(rumbler) {
        this.#collideBodies(rumbler);
        this.#collideHitzones(rumbler);
    }

    #collideHitzones(rumbler) {

    }

    #collideBodies(object) {
        const collision = Collider.RectVsRect(this, object);
        console.log(collision);
        if(!collision) return;
        if(this.position.x < object.position.x) {
            const overlap = this.right - object.left;
            this.position.x -= overlap * 0.5;
            object.position.x += overlap * 0.5;
        }
    }

    update(config) {
        this.move(config.seconds);
        for(const actor of config.database.actors) this.collide(actor);
        if(this.bottom >= GROUND) this.signal('ground', config);
        else this.signal('aerial', config);
    }

    serialize( ) {
        return Object.assign(ActionObject.prototype.serialize.call(this), { });
    }

    collide(object) {
        if(object == this) return;
        if(object instanceof Rumbler) this.#collideRumbler(object);
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

    constructor(width, height) {
        super({width: width, height: height});
        this.#setHooks( );
    }

    #setHooks( ) {
        this.setHook('ground', this.#onGround.bind(this));
    }

    #onGround(config) {

        if(this.buttons.right) this.velocity.x =  80;
        if(this.buttons.left)  this.velocity.x = -80;

        if(this.buttons.up) {
            this.velocity.y = -Math.pow(2 * GRAVITY * 120, 0.5);
            if(this.buttons.right) this.velocity.x =  110;
            if(this.buttons.left)  this.velocity.x = -110;
        }

    }

    update(config) {
        Rumbler.prototype.update.call(this, config);

    }

 }
