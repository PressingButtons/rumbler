Signal.Rumbler = { };

/* 
    AERIAL SIGNALS 
    ================
*/

Signal.Rumbler.aerial = function( config ) {
    this.applyGravity( config );
}

/* 
    GROUNDED SIGNALS 
    ================
*/
Signal.Rumbler.grounded = function( config ) {
    this.bottom = config.floor;
    if( this.velocity.y > 0) this.velocity.y = 0;
    if( this.velocity.y > 0) this.accelaration.y = 0;
}


//=========================================================
//  Movement Signals 
//=========================================================
Signal.Rumbler.walk_forward = function( config ) {
    this.animate( 'walk_forward' );
    this.accelaration.x = 100 * Math.cos( this.rotation.y );
    if( this.accelaration > 0 ) {
        if( this.velocity.x >= this.stats.forward_walk_speed) {
            this.velocity.x = this.stats.forward_walk_speed;
        }
    } else if ( this.accelaration < 0 ) {
        if( this.velocity.x <= -this.stats.forward_walk_speed) {
            this.velocity.x = -this.stats.forward_walk_speed;
        }
    }
}

Signal.Rumbler.walk_backward = function( config ) {
    this.animate('walk_backward')
    this.accelaration.x = -100 * Math.cos( this.rotation.y );
    if( this.accelaration > 0 ) {
        if( this.velocity.x >= this.stats.backward_walk_speed) {
            this.velocity.x = this.stats.backward_walk_speed;
        }
    } else if ( this.accelaration < 0 ) {
        if( this.velocity.x <= -this.stats.backward_walk_speed) {
            this.velocity.x = -this.stats.backward_walk_speed;
        }
    }
}