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
        return this.#gameobject.animations[this.animation];
    }

    get current_frame( ) {
        return this.gameobject.animations[this.animation][this.index];
    }

    #hasAnimation( name ) {
        if(!this.gameobject.animations[ name ]) return false;
    }
    
    #selectAnimation( name ) {
        if(this.animation == name ) return;
        this.animate = name;
        this.#startAnimation( );
    }

    #startAnimation( ) {
        this.index = 0;
        this.time  = 0;
        if( this.current_frame.on_start) 
            this.current_frame.on_start( this.gameobject );
    }

    #endAnimation( ) {
        if( this.current_frame.on_end )
            this.current_frame.on_end( this.gameobject );
        this.#startAnimation( );
    }

    #progressAnimation( interval ) {
        this.time += interval;
        if( this.time >= this.current_frame.duration ) 
            this.#nextFrame( );
    }

    #nextFrame( ) {
        this.time = 0;
        this.index ++;
        if( this.current_frame.on_frame) this.current_frame.on_frame( this.gameobject );
        if( this.index < this.current_animation.frames.length) return ;
        this.#endAnimation( )
    }

    animate( name ) {
        if(!this.#hasAnimation(name)) return;
        this.#selectAnimation( name );
    }

    update( interval ) {
        if( !this.animation ) return;
        this.#progressAnimation( interval );
    }

}

GameLib.GameObject = class extends SignalObject {

    #animator;
    #source;

    constructor( data = { }) {
        super( );
        this.#source = data;
        this.#animator = new GameLib.Animator( data.animations );
        this.current_frame = 0;
        this.position = new Uint16Array(3);
        this.rotation = new Float32Array(3);
        this.half_w = data.width * 0.5;
        this.half_h = data.height * 0.5;
        this.tint = [1, 1, 1, 1];
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

    //private 

    //public 
    animate( name ) {
        this.#animator.animate( name );
    }

    move( x, y ) {
        this.x = x; this.y = y;
    }

    update_animation( interval ) {
        this.#animator.update( interval );
        this.current_frame = this.#animator.current_frame.cell || 0;
    }

    current_state( ) {
        return {
            position: [...this.position],
            rotation: [...this.rotation],
            height: this.source.height,
            width: this.#source.width,
            half_w: this.half_w,
            half_h: this.half_h,
            tint: this.tint
        }
    }

}

GameLib.Rumbler = class extends GameLib.GameObject {

    constructor( data ) {
        super( data );
        this.#init( data );
    }

    #init( data ) {
        this.health_pool = new GameLib.HealthPool( data.health_points );
        this.stamina_pool = new GameLib.StaminaPool( data.stamina_points );
    }

    current_state( ) {
        return Object.assign( super.current_state( ), {
            textures: ['garf'],
            shader: 'single_texture',
        })
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