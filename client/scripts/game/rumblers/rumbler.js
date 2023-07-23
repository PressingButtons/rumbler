GameLib.Rumblers.Rumbler = class extends GameLib.Objects.RigidBody {

    static JUMP_HEIGHT = 60;

    #stats = {
        health: 10000,
        speed: {
            walk_forward: 50,
            walk_backward: 30,
            jump_forward: 90,
            jump_backward: 50
        }
    }

    constructor(width, height, body) {
        super(width, height, body);
        this.stats = this.setStats( );
        this.flags = { nuetral: true, crouch: false }
        this.input = { left: false, right: false, up: false, down: false, A: false, B: false, C: false, d: false}
        this.animator = new GameLib.Components.Animator( this )
        this.#init( );
    }

    #init( ) {
        //this.setRoute('ground', this.#ongroundinput.bind(this));
        //this.setRoute('aerial', this.#onaerialinput.bind(this));
        //this.setRoute('grounded-forward', this.#onGroundedForward.bind(this));
        //this.setRoute('grounded-backward', this.#onGroundedBackward.bind(this));
        this.setRoute('update', this.#update.bind(this));
    }    
    //=====================================
    // Setting Stat
    //=====================================
    #setStat( source, value ) {
        console.log(source, value);
        if(!value) return;
        if( value instanceof Object) 
            for(const key in source) 
                this.#setStat( source[key], Object[key]);
        else source = value;
    }
    //=====================================
    // Grounded Input Route Bindings 
    //=====================================
    #ongroundinput = options => {
        let states = ['grounded'];
        if(options.buttons.down) states.push('down');
        if(options.buttons.up) states.push('up');
        if(this.flags.nuetral) this.#ongroundNuetral( options, states );
    }
    //=====================================
    //  Grounded Nuetral - Actions
    //=====================================
    #ongroundNuetral(options, states) {
        options.rightward = options.other.left > this.right;
        if( options.rightward ) {
            if(options.buttons.left) states.push('back');
            if(options.buttons.right) states.push('forward');
        } else {
            if(options.buttons.left) states.push('forward');
            if(options.buttons.right) states.push('back');
        }

        this.stateSignal( states, options );
    }
    //=====================================
    //  Grounded Forward Actions
    //=====================================
    #onGroundedForward( options ) {
        if(options.rightward) this.#walk('walk_forward', this.#stats.walk_forward , 0, options.interval);
        else this.#walk('walk_backward', -this.#stats.walk_backward, Math.PI, options.interval);
    }
    //=====================================
    //  Grounded Backward Actions
    //=====================================
    #onGroundedBackward( options ) {
        if(options.rightward) this.#walk('walk_backward', this.#stats.walk_backward, Math.PI, options.interval);
        else this.#walk('walk_forward', -this.#stats.walk_forward, 0, options.interval);
    }
    //=====================================
    //  Walking Backward
    //=====================================
    #walk( animation, speed, rotation, interval ) {
        this.animate(animation, interval );
        this.rotation.y = rotation;
        this.velocity.x = speed;
    }
    //=====================================
    //  Update Route function 
    //=====================================
    #update( config ) {
        if( this.land ) {
            if( this.input.right ) this.velocity.x = this.#stats.speed.walk_forward;
            if( this.input.left)   this.velocity.x = -this.#stats.speed.walk_backward;
            if( this.input.up) {
                this.velocity.x = 0;
                this.jump( config.gravity );
                if( this.input.right ) this.velocity.x = this.#stats.speed.jump_forward;
                if( this.input.left  ) this.velocity.x = -this.#stats.speed.jump_backward;
            }
        }
    }
    //=====================================
    //  Public functions                    ==============================================================================
    //=====================================
    jump( gravity ) {
        if(!this.land) return;
        this.velocity.y = -Math.pow((2 * gravity) * GameLib.Rumblers.Rumbler.JUMP_HEIGHT, 0.5); //square root -2 times acceleration times distance
    }
    //=====================================
    //setStats - allows quick assignment of player stats
    //=====================================
    setStats(object = { })  {
        if(!object) return;
        for( const key in this.#stats ) {
            if( object[key] ) this.#setStat( object[key], object[key]);
        }
    }
    //=====================================
    //=====================================
    //=====================================
    //=====================================
    //=====================================
    //=====================================
    //==========================================
    //  stateSignal 
    //  Checks a state string an signals if valid
    //===========================================
    stateSignal( states, options ) {
        if(states.length == 0) return;
        this.signal( states.join('-'), options);
    }
}