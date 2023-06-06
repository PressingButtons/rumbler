GameLib.Rumblers.Rumbler = class extends GameLib.Objects.RigidBody {

    constructor(width, height, body) {
        super(width, height, body);
        this.walk_forward_speed = 100;
        this.walk_backward_speed = 80;
        this.jumpHeight = 70;
        this.flags = { nuetral: true, crouch: false }
        this.animator = new GameLib.Components.Animator( this )
        this.#init( );
    }

    #init( ) {
        //this.setRoute('ground', this.#ongroundinput.bind(this));
        //this.setRoute('aerial', this.#onaerialinput.bind(this));
        //this.setRoute('grounded-forward', this.#onGroundedForward.bind(this));
        //this.setRoute('grounded-backward', this.#onGroundedBackward.bind(this));
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
        if(options.rightward) this.#walk('walk_forward', this.walk_forward_speed, 0, options.interval);
        else this.#walk('walk_backward', -this.walk_backward_speed, Math.PI, options.interval);
    }
    //=====================================
    //  Grounded Backward Actions
    //=====================================
    #onGroundedBackward( options ) {
        if(options.rightward) this.#walk('walk_backward', this.walk_forward_speed, Math.PI, options.interval);
        else this.#walk('walk_forward', -this.walk_backward_speed, 0, options.interval);
    }
    //=====================================
    //=====================================
    //=====================================
    //  Walking Backward
    //=====================================
    #walk( animation, speed, rotation, interval ) {
        this.animate(animation, interval );
        this.rotation.y = rotation;
        this.velocity.x = speed;
    }
    //=====================================
    //  
    //=====================================
    jump( gravity ) {
        if(!this.land) return;
        this.velocity.y = -Math.pow((2 * gravity) * this.jumpHeight, 0.5); //square root -2 times acceleration times distance
    }
    //=====================================
    //=====================================
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