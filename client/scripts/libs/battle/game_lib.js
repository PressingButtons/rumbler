const GameLib = { };

GameLib.Animator = class {

    #gameobject;

    constructor( gameobject ) {
        this.#gameobject = gameobject;
        this.animation = null;
        this.index = 0;
        this.time = 0;
    }

    get gameobject( ) {
        return this.#gameobject;
    }

    get current_animation( ) {
        return this.#gameobject.source.animations[this.animation];
    }

    get current_frame( ) {
        if( this.animation == null) return { };
        return this.gameobject.source.animations[this.animation].frames[this.index];
    }
    
    get current_cell( ) {
        if( this.current_frame.cell == undefined ) return { };
        return this.#gameobject.source.cells[this.current_frame.cell]
    }

    #hasAnimation( name ) {
        return this.gameobject.source.animations[ name ] != null;
    }
    
    #selectAnimation( name ) {
        if(this.animation == name ) return;
        this.animation = name;
        this.#startAnimation( );
    }

    #startAnimation( ) {
        this.index = 0;
        this.time  = 0;
        if( this.current_animation.on_start) 
            this.gameobject.signal(this.current_animation.on_start);
    }

    #endAnimation( ) {
        if( this.current_animation.on_end )
            this.gameobject.signal(this.current_animation.on_end);
        this.#startAnimation( );
    }

    #progressAnimation( interval ) {
        this.time += interval;
        if( this.time >= this.current_frame.duration ) 
            this.#nextFrame( );
    }

    #nextFrame( ) {
        this.time = 0;
        if ( this.index + 1 >= this.current_animation.frames.length ) this.#endAnimation( );
        else {
            this.index ++;
            if( this.current_frame.on_frame) this.current_frame.on_frame( this.gameobject );
        }
    }

    animate( name ) {
        if(!this.#hasAnimation(name)) return;
        this.#selectAnimation( name );
    }

    update( interval ) {
        if( !this.animation ) return;
        this.#progressAnimation( interval * 1000 );
        this.#gameobject.current_frame = this.current_frame;
        this.gameobject.current_cell = this.current_cell;
        ///console.log( this.animation, this.current_frame, this.current_cell, this.index )
    }

}

GameLib.GameObject = class extends SignalObject {

    #animator;
    #source;

    constructor( data = { }) {
        super( );
        this.#source = data;
        this.#animator = new GameLib.Animator( this );
        this.position = new Float32Array(3);
        this.rotation = new Float32Array(3);
        this.half_w = data.width * 0.5;
        this.half_h = data.height * 0.5;
        this.tint = [1, 1, 1, 1];
        this.width = data.width;
        this.height = data.height;
        this.cell = 0;
        this.current_frame = { };
        this.body = { x: 0, y: 0, width: data.width, height: data.height }
    }

    //getters and setters
    get source( ) { return this.#source } 

    get x( ) {return this.position[0]}
    set x(n) {this.position[0] = n}

    get y( ) {return this.position[1]}
    set y(n) {this.position[1] = n}

    get bottom( ) { return this.y + this.half_h; }
    set bottom(n) { this.y = n - this.half_h; }

    get top( ) { return this.y - this.half_h;}
    set top(n) { this.y = n + this.half_h;}

    get right( ) { return this.x + this.half_w }
    set right(n) { this.x = n - this.half_w }

    get left( ) { return this.x - this.half_w }
    set left(n) { this.x = n + this.half_w }

    get rect( ) {
        return {
            top: this.top,
            left: this.left,
            right: this.right,
            bottom: this.bottom,
            width: this.body.width,
            height: this.body.height,
            x: this.x, 
            y: this.y
        }
    }
    //private
    #resolveRectBasic( gameobject ) {
        if( this.x < gameobject.x ) {
            this.x--;
            gameobject.x++;
        } else {
            this.x++;
            gameobject.x--;
        }
    }

    #resolveRectDynamic( gameobject, collision ) {
        if( collision.normal[0] == 1 ) {
            this.x++;
            gameobject.x--;
        } else if ( collision.normal[0] == -1 ) {
           this.x--;
           gameobject.x++;
        }

    }
    
    //public 
    animate( name ) {
        this.#animator.animate( name );
    }

    collideBody( gameobject, velocity = {x: 0, y: 0} ) {
        let collision = Collision.DynamicRect( this.rect, velocity, gameobject.rect);
        if( !collision ) return;
        if( typeof collision == 'boolean' ) {
            this.#resolveRectBasic( gameobject );
        } else {
            //this.#resolveRectDynamic( gameobject, collision );
        }
    }

    turnRight( ) {
        this.rotation[1] = 0;
    }

    turnLeft( ) {
        this.rotation[1] = Math.PI;
    }

    moveTo( x, y ) {
        this.x = x; this.y = y;
    }

    moveBy( x, y) {
        this.x += x; 
        this.y += y;
    }


    update_animation( interval ) {
        this.#animator.update( interval );
        this.cell = this.#animator.current_frame.cell;
        
    }

    get current_state( ) {
        return {
            position: [...this.position],
            rotation: [...this.rotation],
            half_w: this.half_w,
            half_h: this.half_h,
            height: this.height,
            width:  this.width,
            tint:   this.tint,
            cell:   this.cell,
            rect:   this.rect
        }
    }

}

GameLib.HealthPool = class {

    constructor( value ) {
        this.max = value;
        this.current = value;
    }

    depreciate( value ) {
        this.current -= value;
    }

}


GameLib.StaminaPool = class {

    static RECOVERY_INTERVAL = 100;

    constructor( value ) {
        this.max = value;
        this.value = value;
        this.recovery_delay = 0;
        this.recovery_interval = 0;
    }

    #update_delay(interval) {
        if( this.recovery_delay > 0 ) this.recovery_delay -= interval;
        else this.recovery_delay = 0;
    }

    #recover( interval ) {
        this.recovery_interval += interval;
        if( this.recovery_interval < GameLib.StaminaPool.RECOVERY_INTERVAL ) return;
        this.recovery_interval = 0;
        this.value += 1;
    }

    depreciate( value, recovery_delay = 100 ) {
        this.value -= value; 
        this.recovery_delay = recovery_delay;
    }

    update( interval ) {
        this.#update_delay( interval );
        if( this.recovery_delay == 0 ) this.#recover( interval );
    }

}

const Rumbler = { };

Rumbler.GLOBALS = { };

Rumbler.GLOBALS.FORWARD_JUMP = 170;
Rumbler.GLOBALS.BACKWARD_JUMP = 100;

Rumbler.Methods = { };

Rumbler.Methods.land = function( rumbler, options ) {
    rumbler.velocity.y = 0;
    rumbler.bottom = options.floor;
}

Rumbler.Methods.faceOpponent = function( rumbler, options ) {
    if( options.opponent.x > rumbler.x ) rumbler.rotation[1] = 0;
    else rumbler.rotation[1] = Math.PI;
}

Rumbler.Methods.jumpFromGround = function( rumbler, options ) {
    rumbler.velocity.y = -Math.pow((2 * options.gravity * rumbler.source.stats.jump_power), 0.5);
}

Rumbler.Signals = { };

Rumbler.Signals.aerial = function( options ) {
    this.velocity.y += options.gravity * options.interval;
    if( this.velocity.y > 0 ) this.signal('aerial_fall', options);
    else this.signal('aerial_rise', options);
}

Rumbler.Signals.aerial_fall = function( options ) {
    if( this.velocity.y < 0 ) this.velocity.y *= 0.5;
}

Rumbler.Signals.aerial_rise = function( options ) {
    if( !options.control.isPressed('jump') && options.control.isRegistered('jump')) { 
        this.velocity.y *= 0.5;
        options.control.unregister('jump');
    }
}

Rumbler.Signals.aerial_jump = function( options ) {

}

Rumbler.Signals.grounded = function( options ) {
    Rumbler.Methods.land( this, options );
    Rumbler.Methods.faceOpponent( this, options );
    this.signal('friction', options);
    if( options.control.isPressed('right') ) this.signal('grounded_rightward', options);
    if( options.control.isPressed('left') )  this.signal('grounded_leftward', options);
    if( options.control.isPressed('jump') )  this.signal( 'grounded_jump', options );
    if( options.control.isPressed('light'))  this.signal('light_attack', options );
}

Rumbler.Signals.friction = function( options ) {
    if( this.velocity.x != 0 ) this.velocity.x *= options.interval;
    if( Math.abs(this.velocity.x) < 0.3 ) this.velocity.x = 0;
}

Rumbler.Signals.grounded_jump = function( options ) {
    options.control.register('jump');
    Rumbler.Methods.jumpFromGround( this, options );
    if( options.control.isPressed('right') ) 
        if( this.rotation[1] == 0) this.velocity.x = Rumbler.GLOBALS.FORWARD_JUMP;
        else this.velocity.x = Rumbler.GLOBALS.BACKWARD_JUMP;
    if( options.control.isPressed('left') ) {
        if( this.rotation[1] == 0 ) this.velocity.x = -Rumbler.GLOBALS.BACKWARD_JUMP
        else this.velocity.x = -Rumbler.GLOBALS.FORWARD_JUMP;
    }
    this.y--;
}

Rumbler.Signals.grounded_rightward = function( options ) {
    if( options.opponent.left > this.right ) this.signal('walk_forward', Object.assign({ dir:  1}, options ));
    else this.signal('walk_backward', Object.assign({ dir: 1}, options ));
}

Rumbler.Signals.grounded_leftward = function( options ) {
    if( options.opponent.right < this.left ) this.signal('walk_forward', Object.assign({ dir: -1}, options ));
    else this.signal('walk_backward', Object.assign({ dir: -1}, options ));
}

Rumbler.Signals.walk_forward = function( options ) {
    this.velocity.x = this.source.stats.forward_walk_speed * options.dir;
}

Rumbler.Signals.walk_backward = function( options ) {
    this.velocity.x = this.source.stats.backward_walk_speed * options.dir;
}

Rumbler.Signals.light_attack = function( options ) {
    this.animate('light_attack_1');
}

Rumbler.Signals.attack_start = function( options ) {

}

Rumbler.Signals.attack_end = function( option ) {
    this.animate('idle');
}

Rumbler.Instance = class extends GameLib.GameObject {

    constructor( config ) {
        super( config.data );
        this.#init( config );
    }

    get top( ) {
        return this.y + this.body.y;
    }

    set top(n) {
        this.y = n - this.body.y;
    }

    get left( ) {
        return this.x + this.body.x;
    }

    set left(n) {
        this.x = n - this.body.x;
    }

    get right( ) {
        return this.x + this.body.x + this.body.width;
    }

    set right(n) {
        this.x = n - this.body.x - this.body.width;
    }

    get bottom( ) {
        return this.y + this.body.y + this.body.height / 2;
    }

    set bottom(n) {
        this.y = Math.round(n - this.body.y - this.body.height / 2);
    }

    #init( config ) {
        this.#initValues(config);
        this.#initRoutes(config);
        this.animate('idle');
    }

    #initValues(config) {
        this.health_pool = new GameLib.HealthPool( config.data.health_points );
        this.stamina_pool = new GameLib.StaminaPool( config.data.stamina_points );
        this.palette = [0, 0];
        this.cells = config.data.cells;
        this.cell = 0;
        this.textures = [config.data.name];
        this.palette = config.data.palettes[config.palette];
        this.velocity = {x: 0, y: 0};
    }

    #assignRoute( name ) {
        this.onSignal(name, Rumbler.Signals[name].bind(this));
    }

    #initRoutes( ) {
        this.#assignRoute('aerial');
        this.#assignRoute('aerial_fall');
        this.#assignRoute('aerial_rise');
        this.#assignRoute('grounded');
        this.#assignRoute('friction');
        this.#assignRoute('grounded_jump');
        this.#assignRoute('grounded_rightward');
        this.#assignRoute('grounded_leftward');
        this.#assignRoute('walk_forward');
        this.#assignRoute('walk_backward');
        this.#assignRoute('attack_start');
        this.#assignRoute('attack_end');
        this.#assignRoute('light_attack');
    }

    //PRIVATE =================================
    #logic( config ) {
        if( this.bottom + this.velocity.y * config.interval < config.floor )
            this.signal('aerial', config);
        else 
            this.signal('grounded', config );
    }

    #move( config ) {
        this.x += this.velocity.x * config.interval;
        this.y += this.velocity.y * config.interval;
    }
    
    #updateBody( ) {
        Object.assign( this.body, this.cells[this.cell].body );
    }

    //PUBLIC  =================================
    update( config ) {
        this.collideBody( config.opponent, {x: this.velocity.x * config.interval, y: this.velocity.y * config.interval} );
        this.#move( config );
        this.#logic( config );
        this.#updateBody( );
        this.update_animation( config.interval );
    }

    get current_state( ) {
        return Object.assign( super.current_state, {
            textures: this.textures,
            shader: 'rumbler',
            palette: this.palette,
            hurtboxes: this.current_cell.hurtboxes || [],
            hitboxes: this.current_cell.hitboxes || [],
        })
    }

}