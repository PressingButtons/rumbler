const Rumbler = { };

Rumbler.Rumbler = class extends GameObject.DynamicObject {
    constructor( config ) {
        super( config );
        this.shader = 'rumbler';
        this.palette = [0, 0];
        this.#initStats( config );
        this.#initSignals( );
        this.setChannel('update', this.update.bind(this), 0);
        this.hurt = false;
        this.attack = false;
        this.landed = false;
    }

    #initSignals( ) {
        this.setupChannelGroup('aerial', Rumbler.aerial);
        this.setupChannelGroup('grounded', Rumbler.grounded);
    }

    #initStats( config ) {
        this.name = name;
        this.stats = config.stats;
    }

    isNuetral( ) {
        return !this.hurt && !this.attack;
    }

    setupChannelGroup( name, group ) {
        for( const key in group ) {
            const channel_name = name + '-' + key;
            this.setChannel( channel_name, group[key].bind(this));
        }
    }

    update( config ) {
        if( config.world.isOnLand( this )) this.signal('grounded-base', config);
        else this.signal('aerial-base', config);
    }

    pack( ) {
        return Object.assign( super.pack( ), {
            palette: [0, 0]
        });
    }

}
/** =========================================
 *  Rumbler Aerial Signals 
 *  ========================================*/
Rumbler.aerial = { };

Rumbler.aerial.base = function( config ) {
    this.acceleration.y = config.world.gravity;
    if( this.velocity.y < 0 ) this.signal( 'aerial-rising', config );
    else this.signal( 'aerial-falling' , config ); 
}

Rumbler.aerial.rising = function( config ) {

}

Rumbler.aerial.falling = function( config ) {

}

/** =========================================
 *  Rumbler Grounded Signals 
 *  ========================================*/
Rumbler.grounded = { };

Rumbler.grounded.base = function( config ) {
    if( this.acceleration.y > 0) this.acceleration.y = 0;
    if( this.velocity.y > 0) this.velocity.y = 0;
    this.acceleration.y = 0;
    this.landed = true;

    //friction 

    if( this.velocity.x != 0 ) this.velocity.x *= 0.5

    if(this.isNuetral( )) this.signal('grounded-nuetral', config);
}

Rumbler.grounded.nuetral = function( config ) {
    //react to buttons
    if( this.controller.buttons.left.value == 1|| this.controller.buttons.right.value == 1) this.signal('grounded-walk', config);
    if( this.controller.buttons.jump.value == 1 ) this.signal('grounded-jump_start', config ); 
}

Rumbler.grounded.idle = function( config ) {
    //idle animation
}

Rumbler.grounded.walk = function( config ) {

    const left = this.controller.buttons.left.value == 1;
    const right = this.controller.buttons.right.value == 1;

    if( this.rotation.y == 0 ) {
        if( left ) this.signal('grounded-walk_backward', config);
        if( right ) this.signal('grounded-walk_forward', config );
    } else {
        if( left ) this.signal('grounded-walk_forward', config );
        if( right ) this.signal('grounded-walk_backward', config);
    }

}

Rumbler.grounded.walk_forward = function( config ) {
    //walk-forward animation
    this.velocity.x = this.stats.walk_forward * Math.cos( this.rotation.y );
}

Rumbler.grounded.walk_backward = function( config ){
    this.velocity.x = this.stats.walk_backward * -Math.cos( this.rotation.y );
}

Rumbler.grounded.crouching = function( config ) {

}


Rumbler.grounded.jump_start = function( config ) {
    this.signal('grounded-jump_launch', config);
}

Rumbler.grounded.jump_launch = function( config ) {
    this.velocity.y = Math.pow( 2 * config.world.gravity * this.stats.jump_height, 0.5) * -1;
    if( config.right ) this.velocity.x = this.stats.jump_forward * Math.cos( this.rotation.y );
    else if (config.left) this.velocity.x = this.stats.jump_backward * Math.cos( this.rotation.y ) * 1;
}
