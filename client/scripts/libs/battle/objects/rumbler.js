GameObject.Rumbler = class extends GameObject.GameObject {

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

    get current_state( ) {
        return Object.assign(
            {
                palette: this.palette,
                hitboxes: [],
                hurtboxes: []
            }, 
            super.current_state);
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
        this.#assignRoute('grounded');
        this.#assignRoute('walk_forward');
        this.#assignRoute('walk_backward');
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
        if( this.bottom + this.velocity.y * config.interval < config.floor) 
            this.signal('aerial', config );
        else 
            this.signal('grounded', config );
    }

}