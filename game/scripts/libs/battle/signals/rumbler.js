Signal.Rumbler = { };

/* 
    AERIAL SIGNALS 
    ================
*/

Signal.Rumbler.aerial = function( config ) {
    this.applyGravity( config );
    if( this.velocity.y < 0 ) this.signal( 'aerial_rise', config );
    else this.signal( 'aerial_fall', config );
}

Signal.Rumbler.aerial_rise = function( config ){
    if( !config.control.isPressed('jump') && config.control.isRegistered('jump')) {
        this.velocity.y *= 0.5;
        config.control.unregister('jump');
    }
}

Signal.Rumbler.aerial_fall = function( config ) {

}

/* 
    GROUNDED SIGNALS 
    ================
*/
Signal.Rumbler.grounded = function( config ) {
    this.bottom = config.floor;
    if( this.velocity.y > 0) this.velocity.y = 0;
    if( this.acceleration.y > 0) this.acceleration.y = 0;
    this.acceleration.x = 0;

    if( this.isNuetral( )) {

        if( this.velocity.x == 0 ) this.animator.animate('idle');

        if( this.position.x < config.opponent.position.x ) {
            this.rotation.y = 0;
        } else if (this.position.x > config.opponent.position.x ) {
            this.rotation.y = Math.PI;
        }

        if(config.control.isPressed('light')) {
            this.signal('grounded_light_attack_1', config);
            this.signal('attack_start');
        }

        if(!this.isNuetral( )) return; //break out if attacking

        if(config.control.isPressed('right')) {
            if( this.rotation.y == 0 ) this.signal('walk_forward', config);
            else this.signal('walk_backward', config); 
        }
        
        if(config.control.isPressed('left')) {
            if( this.rotation.y > 0) this.signal('walk_forward', config);
            else this.signal('walk_backward', config); 
        }

        if(config.control.isPressed('jump')) {
            this.signal('grounded_jump', config);
        }
    }
    if( this.acceleration.x == 0 && this.velocity.x != 0) this.friction( config );
}

//=========================================================
//  Grounded Movement Signals 
//=========================================================
Signal.Rumbler.walk_forward = function( config ) {
    this.animator.animate( 'walk_forward' );
    this.current_state = 'walk_forward';
    this.acceleration.x = 100 * Math.cos(this.rotation.y);
    this.velocity.x = this.stats.forward_walk_speed * Math.cos(this.rotation.y);
}

Signal.Rumbler.walk_backward = function( config ) {
    this.animator.animate('walk_backward');
    this.current_state = 'walk_backward';
    this.acceleration.x = -100 * Math.cos(this.rotation.y);
    this.velocity.x = this.stats.backward_walk_speed * -Math.cos( this.rotation.y );
}

Signal.Rumbler.grounded_jump = function( config ) {
    config.control.register('jump');
    this.current_state = 'grounded_jump';
    this.velocity.y = -Math.pow( 2 * config.gravity * this.stats.jump_power, 0.5);
    this.velocity.x = 0;
    if( config.control.isPressed('right') ) this.velocity.x = 200;
    else if( config.control.isPressed('left') ) this.velocity.x = -200;
}

//=========================================================
//  Grounded Attack
//=========================================================
Signal.Rumbler.grounded_light_attack_1 = function( config ) {
    this.animator.animate('ground_light_1');
}

/*

    UNIVERSAL SIGNALS ============================================

*/
Signal.Rumbler.attack_start = function( ) {
    this.flags.attack = true;
}
Signal.Rumbler.attack_end = function( ) {
    this.flags.attack = false;
}

Signal.Rumbler.hit_on_enemy = function( config ) {
    if( this.index < config.actor.index ) 
        [this.index, config.actor.index] = [config.actor.index, this.index];
}

Signal.Rumbler.hit_by_enemy = function( config ) {
    if( this.position.x > config.position.x )
        this.velocity.x = 30;
    else this.velocity.x = -30;
}