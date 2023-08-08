class World {

    constructor( config ) {
        this.objects = [ ];
        this.ennumerator = 0;
        this.tiles = config.tiles;
        this.skybox = config.skybox;
    }

    setObject( object, index = this.objects.length ) {
        this.objects.splice( index, 0, object );
        object.world = this;
        object.display_index = function( ) {
            return object.world.objects.indexOf( this );
        }
        object.index = this.ennumerator;
        this.ennumerator++;
    }

    swap( a, b ) {
        [a, b] = [b, a];
    }

    update( game ) {
        for( const object of this.objects ) 
            object.update( game );
    }

}