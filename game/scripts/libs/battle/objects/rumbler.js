GameObject.Rumbler = class extends GameObject.GameActor {

    constructor( config ) {
        super( config.data )
        this.#init( config );
    } 

    //===========================================================
    // Getters and Setters 
    //===========================================================
    get stats( ) {
        return this.build.stats;
    }



    get snapshot( ) {
        return Object.assign(
            {
                palette: this.palette,
                hitboxes: this.hitboxes,
                hurtboxes: this.hurtboxes
            }, 
            super.snapshot);
    }
    //===========================================================
    // Initialization
    //===========================================================
    #init( config ) {
        this.#initValues( config );
        this.#initRoutes( );
        this.#initUpdateMethods( );
        this.animator.animate('idle');
    }

    #initValues( config ) {
        this.flags = { hurt: false, attack: false }
        this.textures = [config.data.name];
        this.palette =  this.build.palettes[ config.palette ];
        this.shader  = 'rumbler';
    }

    #initRoutes( ) {
        this.#assignRoute('aerial');
        this.#assignRoute('aerial_rise');
        this.#assignRoute('aerial_fall');
        this.#assignRoute('grounded');
        this.#assignRoute('grounded_jump');
        this.#assignRoute('grounded_light_attack_1');
        this.#assignRoute('walk_forward');
        this.#assignRoute('walk_backward');
        //universal
        this.#assignRoute('attack_start');
        this.#assignRoute('attack_end');
        this.#assignRoute('hit_on_enemy');
        this.#assignRoute('hit_by_enemy');
    }

    #assignRoute( name ) {
        this.onSignal(name, Signal.Rumbler[name].bind(this));
    }

    #initUpdateMethods( ) {
        this.setUpdateMethod('onRumblerUpdate');
    }

    //===========================================================
    // public method
    //===========================================================
    applyGravity( config ) {
        if( this.acceleration.y < config.gravity) this.acceleration.y = config.gravity;
    }
    //===========================================================
    // on Update Call
    //===========================================================
    onRumblerUpdate( config ) {
        const result = this.hitTest( config.opponent );
        if( result.hits.length > 0 ) {
            this.signal('hit_on_enemy', Object.assign(result, config ));
            config.opponent.signal('hit_by_enemy', this);
        } 

        if( this.bottom + this.velocity.y * config.interval < config.floor) 
            this.signal('aerial', config );
        else 
            this.signal('grounded', config );
    }

    //===========================================================
    // Confirm if Object is in a nuetral state 
    //===========================================================
    isNuetral( ) {
        for( const flag in this.flags )
            if(this.flags[flag]) return false;
        return true;
    }
}