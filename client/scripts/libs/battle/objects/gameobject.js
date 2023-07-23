GameObject.GameObject = class extends SignalObject {

    #update_methods = [ ];

    constructor( data = {}) {
        super( );
        this.#init( data );
        this.shader = 'single_texture'
        this.textures = [];
    } 

    //===========================================================
    // Getters and Setters 
    //===========================================================

    get top( ) { return this.position.y + this.body.y - this.body.height * 0.5 }
    set top(n) { this.position.y = n - this.body.y + this.body.height * 0.5 }

    get bottom( ) { return this.position.y + this.body.y + this.body.height * 0.5};
    set bottom(n) { this.position.y = n - this.body.y - this.body.height * 0.5 };

    get left( ) { return this.position.x + (this.body.x * Math.cos(this.rotation.y)) - this.body.width * 0.5 }
    set left(n) { this.position.x = n - (this.body.x * Math.cos(this.rotation.y)) + this.body.width * 0.5 }

    get right( ) { return this.position.x + (this.body.x * Math.cos(this.rotation.y)) + this.body.width * 0.5 }
    set right(n) { this.position.x = n - (this.body.x * Math.cos(this.rotation.y)) - this.body.width * 0.5 }

    // Current State 
    get current_state( ) {
        return {
            position: this.position.data,
            velocity: this.velocity.data,
            rotation: this.rotation.data,
            accelaration: this.acceleration.data,
            textures: this.textures,
            shader: this.shader,
            height: this.height,
            width: this.width,
            cell: this.cell,
            rect: this.body,
            tint: [1, 1, 1, 1]
        }
    }

    //===========================================================
    // Initialization
    //===========================================================

    #init( data ) {
        this.#initProperties( data );
        this.#initUpdateMethods( );  
    }

    #initProperties( data ) {
        this.build = data;
        this.animator = new Component.Animator( this );
        this.position = new Component.Vector( );
        this.velocity = new Component.Vector( );
        this.rotation = new Component.Vector( );
        this.acceleration = new Component.Vector( );
        this.height = data.height;
        this.width = data.width;
        this.cell = 0;
        this.cell_data = { };
        this.body = { x: 0, y: 0, width: data.width, height: data.height }
    }

    #initUpdateMethods( ) {
        this.setUpdateMethod('update', 100, this.animator);
        this.setUpdateMethod('updateBody');
        this.setUpdateMethod('collideGameObjects');
        this.setUpdateMethod('move');
    }

    //===========================================================
    // updateBody
    //===========================================================
    updateBody( ) {
        Object.assign( this.body, this.animator.curent_cell.body );
        this.body.x = this.animator.curent_cell.body.x * Math.cos( this.rotation.y );
    }
    //===========================================================
    // collision
    //===========================================================
    collideGameObjects( config ) {
        for( const object of config.objects )
            this.#collideGameObject( object );
    }

    #collideGameObject( object ) {

    }
    //===========================================================
    // Movement
    //===========================================================
    move( config ) {
        this.velocity.add( this.acceleration.scaled( config.interval ) );
        this.position.add( this.velocity.scaled( config.interval ) );
    }
    //===========================================================
    // Turning GameObject
    //===========================================================
    turnLeft( ) { this.rotation[0] = 0 }
    turnRight( ) { this.rotation[0] = Math.PI }

    //===========================================================
    // Set update method 
    //===========================================================
    setUpdateMethod( method, priorty = this.#update_methods.length, host = this ) {
        this.#update_methods.push({ method: method, priority: priorty, host: host});
        this.#update_methods.sort((x, y) => {
            x.priority - y.priority
        });
    }

    unsetUpdateMethod( method ) {
        this.#update_methods.forEach(( group, i) => {
            if( group.method == method ) this.#update_methods.splice( i,  1);
        })
    }
    //===========================================================
    // Update Object
    //===========================================================
    update( config ) {
        for( const group of this.#update_methods) {
            group.host[group.method](config);
        }
    }


}