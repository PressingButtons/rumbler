class Rumbler extends GameObject {

    #stats = {
        health: 1000,
        dash_energy: 300,
        projectile_energy: 0,
        forward_walk_speed: 5,
        backward_walk_speed: 3,
        dash_speed: 12,
        jump_height: 200,

    };

    #sequences = { };

    #values = {};

    constructor(config) {
        super(config);
        Object.assign(this.#stats, config.stats);
        this.#initValues( );
        this.#initSequences( );
    }

    #initValues( ) {
        this.#values.health = this.#stats.health;
        this.#values.energy = this.#stats.energy
        this.#values.projectile_energy = this.#stats.energy; 
    }

    #initSequences( ) {
        this.#sequences.activate_state = rumbler_ActiveSequenceTree( );
    }

    update(config) {

    }

}

// Rumbler Active State Tree ==========================================================
function rumbler_ActiveSequenceTree( ) {
    const tree = new Sequence( );
    tree.register('nuetral', null);
    tree.register('attacking', null);
    tree.register('blocking', null);
    tree.register('hurt', null);
    tree.register('movie', null);
    return true;
}



// GROUND STATES ======================================================================
class Rumbler_Ground extends Sequence {

    constructor( ) {
        super( );
    }

    #onGround(tilemap) {
        const bottom_left = tilemap.findTile(this.left, this.bottom);
        const bottom_right = tilemap.findTile(this.right, this.bottom);
        return (bottom_left > 0 || bottom_left > 0);
    }

    #resolveFloor(tilemap) {
        if(!this.#onGround) return this.parent.signal('air');
    }

    operate(config) {
        this.velocity.y = 0;
        this.bottom = config.tile_top;
        this.#resolveFloor( );
    }

}



//Ground End ==========================================================================

// AERIAL STATES ======================================================================
class Rumbler_Aerial extends Sequence {

    constructor( ) {
        super(  );
    }

    operate(config) {
        this.velocity.y += config.gravity * config.seconds;
    }

}