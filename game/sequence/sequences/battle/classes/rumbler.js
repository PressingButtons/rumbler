const Rumbler = { };

Rumbler.Rumbler = class extends GameObject.DynamicObject {
    constructor( config ) {
        super( config );
        this.shader = 'rumbler';
        this.palette = [0, 0];
        this.#initStats( config );
        this.#initSignals( );
        this.setChannel('update', this.update.bind(this), 0)
    }

    #initSignals( ) {
        this.setupChannelGroup('aerial', Rumbler.aerial);
        this.setupChannelGroup('grounded', Rumbler.grounded);
    }

    #initStats( config ) {
        this.name = name;
        this.stats = config.stats;
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
    this.acceleration.y = config.world.gravity * config.ms;
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
    this.acceleration.x = 0;
}

Rumbler.grounded.jump_start = function( config ) {
    this.signal('grounded-jump_launch');
}

Rumbler.grounded.jump_launch = function( config ) {
    this.velocity.y = Math.pow( 2 * config.gravity * this.stats.jump_height, 0.5) * -1;
    if( config.right ) this.velocity.x = this.stats.jump_forward * Math.cos( this.rotation.y );
    else if (config.left) this.velocity.x = this.stats.jump_backward * Math.cos( this.rotation.y ) * 1;
}

Rumbler.grounded.walk_forward = function( config ) {
    //this.acceleration.x = this.stats
}

Rumbler.grounded.walk_backward = function( config ) {
    //this.acceleration.x = 
}
