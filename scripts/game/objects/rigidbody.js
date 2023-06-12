GameLib.Objects.RigidBody = class extends GameLib.Objects.GameObject {

    constructor( width, height, body = null) {
        super( width, height );
        this.body = body ? body : {x: 0, y: 0, width: this.width, height: this.height};
        this.#init( );
    }

    get bottom( ) {
       return (this.position.y - this.height * 0.5) + this.body.y + this.body.height;
    }

    set bottom(n) {
        this.position.y = ( n + this.height * 0.5 ) - this.body.y - this.body.height; 
    }

    get top( ) {
        return (this.position.y - this.height * 0.5) + this.body.y;
    }

    set top(n) {
        this.position.y = n + this.height * 0.5 - this.body.y;
    }

    get left( ) {
        return (this.position.x - this.width * 0.5) + this.body.x; 
    }

    set left(n) {
        this.position.x = n + this.width * 0.5 - this.body.x;
    }

    get right( ) {
        return (this.position.x - this.width * 0.5) + this.body.x + this.body.width; 
    }

    set right(n) {
        this.position.x = (n + this.width * 0.5) - this.body.x - this.body.width;
    }

    get rect( ) {
        return {
            position: this.position,
            left: this.left,
            right: this.right,
            top: this.top, 
            bottom: this.bottom,
            width: this.body.width,
            height: this.body.height    
        }
    }

    #init( ) {
        this.setRoute( 'aerial', this.#aerialRoute.bind(this))
        this.setRoute( 'ground', this.#groundRoute.bind(this));
        this.setRoute( 'update', this.#onupdate.bind(this));
        this.setRoute( 'move', this.#onmovement.bind(this));
    }

    #collideBody( rb, seconds ) {
        if( rb == this ) return;
        const velocity = { x: this.velocity.x * seconds, y: this.velocity.y * seconds }
        this.#resolveCollision( Collision.DynamicRect( this.rect, velocity, rb.rect ), rb, velocity);
    }

    #friction( ) {
        if( this.velocity.x != 0 )  this.velocity.x *= 0.5;
        if( Math.abs(this.velocity.x) < 0.2 ) this.velocity.x = 0;
    }

    #aerialRoute( config ) {
        this.velocity.y += config.gravity * config.seconds;
        this.land = false;
    }

    #groundRoute( config ) {
        if(this.velocity.y > 0) this.velocity.y = 0;
        this.bottom = config.ground_level;
        this.land = true;
    }

    #onmovement( config ) {
        if( this.land ) this.#friction( );
    }

    #onupdate( config ) {
        if( this.bottom >= config.ground_level ) this.signal('ground', config);
        else this.signal('aerial', config); 
        this.#resolveObjects(config);
        this.signal('move', config);
    }

    #resolveCollision(collision, rb, velocity) {
        if(!collision) return;
        this.#resolveCollisionX( collision, rb );
        /*
        const v1 = this.velocity.x;
        const v2 = rb.velocity.x;
        this.velocity.x += collision.normal[0] * Math.abs( v1 * 0.5 ) + v2;
        rb.velocity.x   -= collision.normal[0] * Math.abs( v1 * 0.5 ) + v2; 
        */
    }

    #resolveCollisionX( collision, rb ) {
       if( this.position.x < rb.position.x ) {
            this.right = collision.contact.x + this.body.width * 0.5;
            rb.left    = this.right + 1;
       } else {
            this.left = collision.contact.x - this.body.width * 0.5;
            rb.right  = this.left - 1;
       }
    }

    #resolveObjects(config) {
        for(const object of config.objects) {
            this.#collideBody( object, config.seconds );
        }
    }

}