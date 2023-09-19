// Components are Objects that are tagged onto GameObjects or Systems.
// Components are not typically extended form another class 
const Components = { };
// ===================================
//  Animator - Handles the animation of a given GameObject
// ===================================
Components.Animator = class {
    #animations;
    #current_animation = null;
    #time = 0;
    #index = 0;
    #oncomplete = null;

    constructor( host ) {
        this.host = host;
        this.setAnimations( );
    }

    get current_animation( ) {
        return this.#animations[this.#current_animation];
    }

    get current_frame( ) {
        return this.#animations[this.#current_animation].frames[this.#index];
    }

    #next( ) {
        this.#index++;
        this.#time = 0;
        if( this.#index < this.current_animation.frames.length - 1) return;
        this.host.signal( this.#oncomplete );
        this.#index = 0;
    }

    #start( ) {
        this.#time = 0;
        this.#index = 0;
        this.host.signal( this.current_frame.signal );
        this.update(0);
    }

    animate( name, oncomplete = null) {
        if( name == this.#current_animation ) return;
        const animation = this.#animations[ name ];
        if( !animation ) {
            console.error( 'ANIMATION ERR', 'invalid animation name', name)
            return this.animate('default');
        }
        this.#current_animation = name;
        this.#oncomplete = oncomplete;
        this.#start( );
    }

    setAnimations( animations = { } ) {
        this.#animations = Object.assign({
            default: { frames: [{ index: 0, time: 100, signal: null }]}
        }, animations );
        this.animate('default');
    }  

    update( ms ) {
        this.#time += ms;
        if( this.#time >= this.current_frame.time ) 
            this.#next( );
        this.host.cell = this.#index;
    }
}

// ===================================
//  Input Buffer - well...an input buffer  
// ===================================
Components.InputBuffer = class extends Objects.SignalObject {

    static BUFFER_TIMELIMIT = 300;

    constructor(  ) {
        super( );
        this.buffer = [ ];
        this.commands = { };
    }

    log( config ) {
        console.log( config );
    }

}

// ===================================
//  Player Manager - oversees player objects 
// ===================================
Components.PlayerManager = class {

    constructor( player_data, config ) {
        this.rumbler = new Rumbler.Rumbler( config.data[player_data.name] );
        this.team = player_data.team;
        this.input_source = this.#assignLogicSource( player_data.input )
        this.input_buffer = new Components.InputBuffer( );
    }

    #assignLogicSource( source ) {
        if(!source.includes('computer')) return source;
    }

    readInput( input ) {
        if( input.source != this.input_source ) return;
        Object.assign( this.rumbler.input, input.pad );
        console.log( this.rumbler.input );
    }

}

// ===================================
//  Vector - Holds a typed array of 3 with simple functions to manipulate
// ===================================
Components.Vector = class {

    constructor( typedArrayClass ) {
        this.data = new typedArrayClass( 3 );
    }

    get x( ) { return this.data[0] }
    set x(n) { this.data[0] = n }
    //==============================
    get y( ) { return this.data[1] }
    set y(n) { this.data[1] = n }
    //==============================
    get z( ) { return this.data[2] }
    set z(n) { this.data[2] = n }

    add( vector ) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
    }

    addScaled( vector, scalar ) {
        this.x += vector.x * scalar;
        this.y += vector.y * scalar;
        this.z += vector.z * scalar;
    }

    subtract( vector ) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
    }

    scalarMultiply( num ) {
        this.x *= num;
        this.y *= num;
        this.z *= num;
    }

    setData( vector ) {
        this.data.set( vector.data );
    }
    
}
// ===================================
//  World - Holds Gameobjects 
// ===================================
Components.World = class {

    static BOUND_H = 300;
    static BOUND_W = 400;
    static FLOOR   = 225;
    static GRAVITY = 980;

    constructor( ) {
        this.#createLayers( );
    }

    get objects( ) {
        return [
            ...this.level,
            ...this.sfx_under,
            ...this.gameobjects,
            ...this.sfx_over
        ]
    }

    #createLayers( ) {
        this.level = [ ];
        this.sfx_under = [ ];
        this.gameobjects = [ ];
        this.sfx_over = [ ];
    }

    #setStage( ) {
        this.level.push(new GameObjects.GameObject({ width: 816, height: 600, texture: 'dusk' }));
        this.level.push(new GameObjects.GameObject({ width: 816, height: 320, texture: 'sandbox'}));
        this.level[1].bottom = Components.World.BOUND_H;
    }

    init( config ) {
        this.#setStage( config );
    }

    setObject( object ) {
        this.gameobjects.push( object );
        object.swap = function( a ) {
            if( this.gameobjects.indexOf( a ) != -1) {
                [object, a] = [a, object];
            }
        }
    }

    update( ms, camera ) {
        const config = { ms: ms, seconds: ms * 0.001, world: this};
        for(const object of this.objects ) object.signal('update', config);
        camera.update( );
        this.level[0].position.setData( camera.position );
        return this.objects.map( x => x.pack( ));
    }

}
// ===================================
//  Camera - How do we even See!?
// ===================================
Components.Camera = class {

    constructor( ) {
        this.position = new Components.Vector(Float32Array);
        this.resolution = [400, 225];
        this.scale = 2
    }

    //left
    get left( ) { return this.position.x - this.resolution[0] / this.scale }
    set left(n) { this.position.x = n + this.resolution[0] / this.scale }
    //right
    get right( ) { return this.position.x + this.resolution[0] / this.scale }
    set right(n) { this.position.x = n - this.resolution[0] / this.scale }
    //top
    get top( ) {return this.position.y - this.resolution[1] / this.scale }
    set top(n) { this.position.y = n + this.resolution[1] / this.scale }
    //bottom 
    get bottom( ) {return this.position.y + this.resolution[1] / this.scale }
    set bottom(n) { this.position.y = n - this.resolution[1] / this.scale }

    get rect( ) {
        return [this.left, this.right, this.bottom, this.top];
    }

    #getMin( min, object) {
        if( !min ) return { x: object.left, y: object.top }
        min.x = min.x > object.left ? object.left : min.x;
        min.y = min.y > object.top ? object.top : min.y;
        return min
    }

    #getMax( max, object ) {
        if( !max ) return { x: object.right, y: object.bottom }
        max.x = max.x < object.right ? object.right : max.x;
        max.y = max.y < object.bottom ? object.bottom : max.y;
        return max
    }

    #reposition( min, max ) {
        this.position.x = min.x + (max.x - min.x) * 0.5;
        this.position.y = min.y + (max.y - min.y) * 0.5;
        this.#resolveBounds( );
    }

    #resolveBounds( ) {
        if( this.top    < -Components.World.BOUND_H ) this.top    = -Components.World.BOUND_H;
        if( this.bottom >  Components.World.BOUND_H ) this.bottom =  Components.World.BOUND_H;
        if( this.left   < -Components.World.BOUND_W ) this.left   = -Components.World.BOUND_W;
        if( this.right  >  Components.World.BOUND_W ) this.right  =  Components.World.BOUND_W;
    }

    track( objects ) {
        this.focus = objects;
    }

    update( ) {
        let min, max;
        for( const object of this.focus ) {
            min = this.#getMin( min, object );
            max = this.#getMax( max, object );
        }
        this.#reposition( min, max );
    }
    
}