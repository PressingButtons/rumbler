// ==============================================
//  Projectiles 
// ==============================================
const Projectile = { };

Projectile.Base = class extends GameObjects.DynamicObject {

    constructor( config ) {
        super( config );
        this.#init( config );
    }

    #init( config ) {
        this.#initValues( config );
        this.#initChannels( config );
    }

    #initValues( config ) {
        this.velocity.add( config.velocity );
        this.lifetime = config.stats.lifetime;
        this.homing = config.stats.homing;
        this.team   = config.team;
        this.shader = 'palette';
        this.palette = config.palette;
    }

    #initChannels( config ) {
        this.setChannel('update', )
    }

}