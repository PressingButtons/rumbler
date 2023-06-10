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

    #init( ) {
        this.setRoute( 'aerial', this.#aerialRoute.bind(this))
        this.setRoute( 'ground', this.#groundRoute.bind(this));
        this.setRoute( 'update', this.#onupdate.bind(this));
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
        this.#friction( ); 
        this.land = true;
    }

    #onupdate( config ) {
        this.move(config.seconds);
        if( this.bottom >= config.ground_level ) this.signal('ground', config);
        else this.signal('aerial', config); 
    }

    move( seconds ) {
       this.position.x += this.velocity.x * seconds;
       this.position.y += this.velocity.y * seconds;
    } 

}