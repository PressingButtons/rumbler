GameLib.Objects.RigidBody = class extends GameLib.Objects.GameObject {

    constructor( width, height, body = null) {
        super( width, height );
        this.body = body ? body : {x: 0, y: 0, width: this.width, height: this.height};
        this.#init( );
    }

    get bottom( ) {
       return this.position.y + this.body.height - this.body.y;
    }

    set bottom(n) {
       // this.position.y = n - this.body.y - this.body.height;
    }

    #init( ) {
        this.setRoute( 'aerial', this.#aerialRoute.bind(this))
        this.setRoute( 'ground', this.#groundRoute.bind(this));
        this.setRoute( 'update', this.#onupdate.bind(this));
    }

    #aerialRoute( config ) {
        this.velocity.y += config.gravity * config.seconds;
        console.log('falling');
    }

    #groundRoute( config ) {
        this.velocity.y = 0;
        this.bottom = config.ground_level;
        if( this.velocity.x != 0 ) this.velocity.x *= 0.8;
        if( this.velocity.x < 0.2 ) this.velocity.x = 0; 
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