const Rumbler = { };
// ====================================
//  Rumbler - The basis for all fighter characters in this game
// ====================================
Rumbler.Rumbler = class extends GameObjects.DynamicObject {

    constructor( config ){
        super( config );
        this.#init(config);
    }

    #init( config ) {
        this.animator.setAnimations( config.animations );
        this.shader = 'rumbler';
        this.palette = config.palette ? config.palettes[config.palette] : config.palettes[0];
        this.flags = {};
        this.input_state = new Set( );
        this.stats = config.stats;
        this.setChannelGroup( 'aerial', Rumbler.aerial );
        this.setChannelGroup( 'grounded', Rumbler.grounded );
        this.setChannel('update', this.#onupdate.bind(this));
        this.input = { }
    }

    #onupdate( config ) {
        this.acceleration.x = 0;
        this.acceleration.y = 0;
        if( this.bottom < Components.World.FLOOR ) this.signal('aerial-base', config);
        else this.signal('grounded-base', config );
        this.move( config.ms );
    }


    friction( ms ) {
        if( this.velocity.x != 0) 
            this.acceleration.x = -this.velocity.x * 0.5;
        if( Math.abs(this.velocity.x) < 0.1 ) 
            this.velocity.x = 0;
    }

    isNuetral( ) {
        return true;
    }

    jump( height, gravity ) {
        this.velocity.y = -Math.pow( 2 * gravity * height, 0.5);
    }

    onground( config ) {
        if( this.acceleration.y > 0 ) this.acceleration.y = 0;
        if( this.velocity.y > 0 ) this.velocity.y = 0;
        this.acceleration.y = 0;
        this.flags.landed = true;
        this.bottom = Components.World.FLOOR;
    }

    pack( ) {
        return Object.assign( super.pack( ), {
            palette: this.palette
        });
    }

    setChannelGroup( name, group ) {
        for( const key in group ) {
            const channel_name = name + '-' + key;
            this.setChannel( channel_name, group[key].bind(this));
        }
    }
    
}

// ====================================
//  Rumbler Aerial Signals 
// ====================================
Rumbler.aerial = { };

Rumbler.aerial.base = function( config ) {
    this.oninput = function( ) { };
    this.flags.landed = false;
    this.acceleration.y = Components.World.GRAVITY * config.ms * 0.001;
    if( this.velocity.y < 0 ) this.signal('aerial-rising', config );
    else this.signal('aerial-falling', config );
}

Rumbler.aerial.rising = function( config ) {
    if( !this.input.direction == 1 && this.flags.jumphold ) {
        this.velocity.y *= 0.9;
        this.jumphold = false;
    } 

}

Rumbler.aerial.falling = function( config ) {

}
// ====================================
//  Rumbler Ground Signals 
// ====================================
Rumbler.grounded = { };

Rumbler.grounded.base = function( config ) {
    this.oninput = function( ) { };
    this.onground(config);
    this.friction(config);
    if( this.isNuetral( ) ) {
        if( this.velocity.x == 0) 
            this.signal('idle', config );
    } 
    //oninput
    if( this.input.direction == 8 ) {
        this.velocity.x = this.stats.walk_forward * Math.cos( this.rotation.y );
    }
    if( this.input.direction == 4 ) {
        this.velocity.x = this.stats.walk_backward * -Math.cos( this.rotation.y );
    }

    if(this.input.direction == 1 || this.input.direction == 5 || this.input.direction == 9) {
        this.signal('grounded-jump', config);
    }
}

Rumbler.grounded.idle = function( config ) {

}

Rumbler.grounded.jump = function( config ) {
    this.jump( this.stats.jump_height, Components.World.GRAVITY );
    this.velocity.x = 0;
    this.acceleration.x = 0;
    if( this.input.direction == 9 ) 
        this.velocity.x = this.stats.jump_forward * Math.cos( this.rotation.y );
    if( this.input.direction == 5 ) 
        this.velocity.x = this.stats.jump_backward * -Math.cos( this.rotation.y );
    this.flags.jumphold = true;
}