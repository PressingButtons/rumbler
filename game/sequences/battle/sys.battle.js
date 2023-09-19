
class BattleSystem extends SignalObject {

    constructor( config ) {
        super( );
        this.camera = new Camera( );
        this.camera.scale = 1;
        this.#initWorld( config );
        this.#initPlayers( config );
    }

    #initWorld( config ) {
        this.world = new World( config.stage );
        this.time = config.time || 'infinity';
    }

    #initPlayers( config ) {
        this.p1 = new PlayerManager( config.p1 );
        this.p2 = new PlayerManager( config.p2 );
        // ===================================
        this.p1.move( -50, 0 );
        // ===================================
        this.p2.move( 50, 0 );
        this.p2.turn( 1 );
        // ===================================
        this.world.add( this.p1.object );
        this.world.add( this.p2.object );
        // ===================================
    }

    #update( interval ) {
        this.world.update( interval );
        this.signal('instance');
    }

    handleInput( data ) {
        this.p1.handleInput( data );
        this.p2.handleInput( data );
    }

    instance( ) {
        return {
            camera: this.camera.pack( ),
            objects: this.world.pack( )
        }
    }

    run( interval ) {
        clearInterval( this.update_id );
        const rate = 1000 / interval
        this.update_id = setInterval( this.#update.bind(this), rate, rate );
    }

}

/** ===========================================================
 *  World
 *  ==========================================================*/
class World {

    static TILESIZE = 16;

    constructor( config ) {
        this.objects = [ ];
        this.tiles = config.tiles;
        this.gravity = 50;
        this.level = new LevelDesign( config );
        this.add( this.level.skybox );
        this.add( this.level.background );
        this.add( this.level.mainground );
    }

    #organize( ) {
        this.objects.sort((a, b) => { return a.depth - b.depth });
        for(const object of this.objects) object.depth = this.objects.indexOf( object );
    }


    add( object, depth = this.objects.length ) {
        object.depth = depth;
        this.objects.push( object );
        this.#organize( );
    }

    mapPosition( x, y ) {
        return {
           col: Math.floor((x) / World.TILESIZE),
           row: Math.floor((y) / World.TILESIZE)
        }
    }

    update( interval ) {
        const config = { world: this, interval, interval, ms: interval * 0.01 } 
        for(const object of this.objects) object.signal('update', config );
        this.#organize( );
    }

    pack( ) {
        return this.objects.map( object => object.pack( ));
    }

    getTile( x, y ) {
        const coord = this.mapPosition( x, y );
        const index = `${coord.row}:${coord.col}`;
        return this.tiles.map[index];
    }

    isOnLand( object ) {
        if( this.getTile(object.left, object.bottom) || this.getTile(object.right, object.bottom)) return true;
        else return false;
    }

    resolveX( ) {

    }

    resolveY( object) {
        if( this.isOnLand(object) ) {
            object.velocity.y = 0;
            object.acceleration.y = 0;
        }
    }

}

/** ===========================================================
 *  Camera
 *  ==========================================================*/
class Camera {

    constructor( ) {
        this.height = 450;
        this.width = 800;
        this.scale = 1;
        this.position = new Vector.Vector( Int16Array );
    }

    get left( ) { return this.position.x - this.width * 0.5 / this.scale; }
    set left(n) { this.position.x = n + this.width * 0.5 / this.scale; }

    get right( ) { return this.position.x + this.width * 0.5 / this.scale; }
    set right(n) { this.position.x = n - this.width * 0.5 / this.scale; }

    get top( ) { return this.position.y - this.height * 0.5 / this.scale; }
    set top(n) { this.position.y = n + this.height * 0.5 / this.scale; }

    get bottom( ) { return this.position.y + this.height * 0.5 / this.scale; }
    set bottom(n) { this.position.y = n - this.height * 0.5 / this.scale; }

    pack( ) {
        return { left: this.left, right: this.right, top: this.top, bottom: this.bottom };
    }

}
/** ===========================================================
 *  Player Manager
 *  ==========================================================*/
class PlayerManager {

    constructor( detail ) {
        this.object = new Rumbler.Rumbler( detail.actor );
        this.object.controller = new PlayerController( detail.control_settings );
    }

    handleInput( input ) {
        if( input.detail.source != this.object.controller.source ) return;
        this.object.controller.read(input);
    }

    move( x, y ) {
        this.object.position.x = x;
        this.object.position.y = y;
    }

    turn( n ) {
        this.object.rotation.y = n * Math.PI;
    }

}

class PlayerController {

    #buttons = {
        up:     {value: 0, pressed: 0, released: 0},
        down:   {value: 0, pressed: 0, released: 0},
        left:   {value: 0, pressed: 0, released: 0},
        right:  {value: 0, pressed: 0, released: 0},
        light:  {value: 0, pressed: 0, released: 0},
        strong:  {value: 0, pressed: 0, released: 0},
        special:  {value: 0, pressed: 0, released: 0},
        guard:  {value: 0, pressed: 0, released: 0},
        jump:  {value: 0, pressed: 0, released: 0},
    }

    #buttonSet = new Set( );

    #map = { };

    constructor( config ) {
        this.source = config.source;
        this.#initMap( config.buttons );
    }

    get buttons( ) {
        return this.#buttons;
    }

    get active_buttons( ) {
        return this.#buttonSet;
    }

    #initMap( map ) {
        for( const index in map ) this.#map[index] = map[index];
    }

    #directionalClean( ) {
        //clean directional inputs
    }

    #update( input ) {
        if( !this.#map[input.detail.index]) return;
        for( const index of this.#map[input.detail.index]) {
            if( input.type == 'input_pressed') {
                this.#buttons[index].value = 1;
                this.#buttons[index].pressed = input.detail.timestamp;
                this.#buttonSet.add(index)
            } else {
                this.#buttons[index].value = 0;
                this.#buttons[index].released = input.detail.timestamp;
                this.#buttonSet.delete(index);
            }
        }

        this.#directionalClean( );

    }

    read( input ) {
        this.#update( input );
    }

}

/** ===========================================================
 *  Level Design
 *  ==========================================================*/
class LevelDesign {

    constructor( config ) {
        this.skybox     = new GameObject.GameObject( config.skybox );
        this.background = new GameObject.GameObject( config.background );
        this.mainground = new GameObject.GameObject( config.mainground );
    }
    
}