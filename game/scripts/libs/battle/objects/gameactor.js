GameObject.GameActor = class extends GameObject.GameObject {

    constructor(data) {
        super( data );
    }

    get hitboxes( ) {
        const cell = this.animator.current_cell;
        const hitboxes = cell.hitboxes.map( hitbox => {return {...hitbox}});
        for(const hitbox of hitboxes) hitbox.x *= Math.cos(this.rotation.y);
        return hitboxes; 
    }

    get hurtboxes( ) {
        const cell = this.animator.current_cell;
        const hurtboxes = cell.hurtboxes.map( hurtbox => {return {...hurtbox}});
        for(const hurtbox of hurtboxes) hurtbox.x *= Math.cos(this.rotation.y);
        return hurtboxes; 
    }

    #transformBoxToRelative( object, box ) {

        const x = object.position.x + box.x;
        const y = object.position.y + box.y;

        return Object.assign( box, 
            {
                x: x, y: x, 
                left: x - box.width * 0.5,
                right: x + box.width * 0.5,
                top: y - box.height * 0.5, 
                bottom: y + box.height * 0.5  
            }
        )
    }

    hitTest( gameactor ) {
        const result = { hits: [ ], actor: gameactor }
        if( this.hitboxes.length == 0 ) return result;
        for( const hitbox_data of this.hitboxes) {
            const hitbox = this.#transformBoxToRelative( this, hitbox_data );
            for (const hurtbox_data of  gameactor.hurtboxes) {
                const hurtbox = this.#transformBoxToRelative( gameactor, hurtbox_data );
                const collision = Collision.Rect2Rect( hitbox, hurtbox );
                if( collision ) result.hits.push({hit: hitbox, hurt: hurtbox });
            }
        }
        return result;
    }

}