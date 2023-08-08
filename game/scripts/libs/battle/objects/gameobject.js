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

    get cell( ) {
        return this.animator.current_frame.cell || 0;
    }

    // Current State 
    get snapshot( ) {
        return {
            position: this.position.data,
            velocity: this.velocity.data,
            rotation: this.rotation.data,
            acceleration: this.acceleration.data,
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
        Object.assign( this.body, this.animator.current_cell.body );
        this.body.x = this.animator.current_cell.body.x * Math.cos( this.rotation.y );
    }
    //===========================================================
    // collision
    //===========================================================
    collideGameObjects( config ) {
        for( const object of config.objects ) {
            if( object == this ) continue;
            else this.#collideGameObject( config.interval, object );
        }
    }

    #collideGameObject( interval, object ) {
        const collision = Collision.GameObject2GameObject( interval, this, object );
        if( collision === true ) this.#resolveBodyRect(object);
        else if( collision && collision.contact ) this.#resolveBodyDynamic( collision, object );
    }

    #resolveBodyRect( object ) {
        if( this.position.x < object.position.x ) {
            const cp = this.position.x + ( object.position.x - this.position.x ) / 2;
            this.right = cp - 1;
            object.left = cp + 1;
        } else {
            const cp = object.position.x + ( this.position.x - object.position.x ) / 2;
            object.right = cp - 1;
            this.left = cp + 1;
        }
    }

    #resolveBodyDynamic( collision, object ) {
        //console.log(collision)
    }
    //===========================================================
    // Movement
    //===========================================================
    move( config ) {
        this.velocity.add( this.acceleration.scaled( config.interval ) );
        this.position.add( this.velocity.scaled( config.interval ) );
    }

    friction( config ) {
        this.velocity.x *= 0.5;
        if( Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0;
    }
    //===========================================================
    // Turning GameObject
    //===========================================================
    turnLeft( ) { this.rotation[0] = 0 }
    turnRight( ) { this.rotation[0] = Math.PI }

    //===========================================================
    // Set update method 
    //===========================================================
    setUpdateMethod( method, priority = this.#update_methods.length, host = this ) {
        this.#update_methods.push({ method: method, priority: priority, host: host});
        this.#update_methods.sort((x, y) => {
           return x.priority - y.priority
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