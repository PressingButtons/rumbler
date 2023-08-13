
class BattleSystem extends SignalObject {

    constructor( config ) {
        super( );
        this.camera = new Camera( );
        this.camera.scale = 2;
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
        this.gravity = 100;
        this.level = new LevelDesign( config );
        this.add( this.level.skybox );
        this.add( this.level.background );
        this.add( this.level.ground );
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

    update( interval ) {
        const config = { world: this, interval, interval, ms: interval * 0.01 } 
        for(const object of this.objects) object.signal('update', config );
        this.#organize( );
    }

    pack( ) {
        return this.objects.map( object => object.pack( ));
    }

    bottomLeftTile( object ) {
        const index = `${object.bottom}:${object.left}`;
        console.log( index );
        return this.tiles.map[index];
    }

    bottomRightTile( object ) {
        const index = `${object.bottom}:${object.right}`;
        return this.tiles.map[index];
    }

    isOnLand( object ) {
        const left  = this.bottomLeftTile(object);
        if( left ) return true; 
        const right = this.bottomRightTile(object);
        if( right ) return true;
        return false;
    }

    resolveX( ) {

    }

    resolveY( ) {

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
        this.object = new Rumbler.Rumbler( detail );
    }

    move( x, y ) {
        this.object.position.x = x;
        this.object.position.y = y;
    }

    turn( n ) {
        this.object.rotation.y = n * Math.PI;
    }

}

/** ===========================================================
 *  Level Design
 *  ==========================================================*/
class LevelDesign {

    constructor( config ) {
        this.skybox     = new GameObject.GameObject( config.skybox );
        this.skybox.bottom = 225;
        this.background = new GameObject.GameObject( config.background );
        this.ground     = new GameObject.GameObject( config.mainground );
        this.ground.bottom = 225;
    }
    
}