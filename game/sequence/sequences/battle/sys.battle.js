
class BattleSystem extends SignalObject {

    constructor( config ) {
        super( );
        this.world = new World( config.stage );
        this.camera = new Camera( );
    }

    instance( ) {
        return {
            camera: this.camera.pack( ),
            objects: this.world.pack( )
        }
    }

}

/** ===========================================================
 *  World
 *  ==========================================================*/
class World {

    constructor( config ) {
        this.objects = [ ];
        this.tiles = config.tiles;
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
        for(const object of this.objects) {
            object.signal('update', { objects: a} )
        }
        this.#organize( );
    }

    pack( ) {
        return this.objects.map( object => object.pack( ));
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

    get left( ) { return this.position.x - this.width * 0.5 * this.scale; }
    set left(n) { this.position.x = n + this.width * 0.5 * this.scale; }

    get right( ) { return this.position.x + this.width * 0.5 * this.scale; }
    set right(n) { this.position.x = n - this.width * 0.5 * this.scale; }

    get top( ) { return this.position.y - this.height * 0.5 * this.scale; }
    set top(n) { this.position.y = n + this.height * 0.5 * this.scale; }

    get bottom( ) { return this.position.y + this.height * 0.5 * this.scale; }
    set bottom(n) { this.position.y = n - this.height * 0.5 * this.scale; }

    pack( ) {
        return { left: this.left, right: this.right, top: this.top, bottom: this.bottom };
    }

}
/** ===========================================================
 *  Player Manager
 *  ==========================================================*/
class PlayerManager {

    constructor( detail ) {
        this.object = new Rumbler( detail.rumbler );
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
        this.ground     = new GameObject.GameObject( config.ground );
        this.ground.bottom = 225;
    }
    
}