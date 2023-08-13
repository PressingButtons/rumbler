const GameObject = { };


GameObject.GameObject = class extends SignalObject {

    constructor( config ) {
        super( );
        this.position = new Vector.Vector( Int16Array )
        this.rotation = new Vector.Vector( Float32Array );
        this.texture = config.texture;
        this.width = config.width;
        this.height = config.height;
        this.hw = config.height * 0.5;
        this.hh = config.height * 0.5;
        this.shader = 'single_texture';
        this.tint = [1, 1, 1, 1];
        this.cell = 0;
    }

    get left( ) { return this.position.x - this.hw }
    set left(n) { this.position.x = n + this.hw  }

    get right( ) { return this.position.x + this.hw }
    set right(n) { this.position.x = n - this.hw }

    get top( ) { return this.position.y - this.hh }
    set top(n) { this.position.y  = n + this.hh }

    get bottom( ) { return this.position.y + this.hh }
    set bottom(n) { this.position.y = n - this.hh }

    pack( ) {
        return {
            position: [...this.position.data],
            rotation: [...this.rotation.data],
            width: this.width,
            height: this.height,
            texture: this.texture,
            shader: this.shader,
            tint: this.tint,
            cell: this.cell
        }
    }

}

GameObject.DynamicObject = class extends GameObject.GameObject {

    constructor( config ){
        super( config )
        this.velocity = new Vector.Vector( Float32Array );
        this.acceleration = new Vector.Vector( Float32Array );
        this.setChannel('update', this.move.bind(this) );
    }

    pack( ) {
        return Object.assign( super.pack( ), {
            velocity: [...this.velocity.data],
            acceleration: [...this.acceleration.data]
        })
    }

    move( config ) {
        this.velocity.addScaled( this.acceleration, config.ms );
        this.position.x += this.velocity.x;
        config.world.resolveX( this );
        this.position.y += this.velocity.y;
        config.world.resolveY( this );
    }

}