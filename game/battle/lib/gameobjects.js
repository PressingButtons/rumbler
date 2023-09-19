//This file holds base definitions for objects to be used in the game environment
const GameObjects = { };
// ============================================
//  GameObject - The eponymous base of all objects within the game environment
//               Every displayable object is a gameobject
// ============================================
GameObjects.GameObject = class extends Objects.SignalObject {

    constructor( config ) {
        super( );
        this.#set( config );
    }

    #set( config ) {
        this.size = [ config.width || 1, config.height || 1];
        this.position = new Components.Vector(Float32Array);
        this.rotation = new Components.Vector(Float32Array);
        this.animator = new Components.Animator( this );
        this.texture = config.texture;
        this.shader = 'single_texture';
        this.tint = [1, 1, 1, 1];
    }

    get width( ) { return this.size[0]; }
    get height( ) {return this.size[1]; }

    get hw( ) { return this.size[0] * 0.5 }
    get hh( ) { return this.size[1] * 0.5 }

    get left( ) { return this.position.x - this.hw }
    set left(n) { this.position.x = n + this.hw }
    
    get right( ) { return this.position.x + this.hw }
    set right(n) { this.position.x = n - this.hw }

    get top( ) { return this.position.y - this.hh }
    set top(n) { this.position.y = n + this.hh }

    get bottom( ) {return this.position.y + this.hh }
    set bottom(n) {this.position.y = n - this.hh }

    pack( ) {
        return {
            width: this.width,
            height: this.height,
            cell: this.cell || 0,
            rotation: [...this.rotation.data],
            position: [...this.position.data],
            shader: this.shader,
            texture: this.texture,
            tint: this.tint

        }
    }

}

// ============================================
//  DynamicObject - Extends GameObject adding motion and 
//                  collision properties
// ============================================
GameObjects.DynamicObject = class extends GameObjects.GameObject {

    constructor( config ) {
        super( config );
        this.#set( config );
    }

    #set( config ) {
        this.velocity = new Components.Vector(Float32Array);
        this.acceleration = new Components.Vector(Float32Array);
    }

    move( ms ) {
        this.velocity.add( this.acceleration );
        this.position.addScaled( this.velocity, ms * 0.001 );
    }

    pack( ) {
        return Object.assign( super.pack( ), { acceleration: this.acceleration, velocity: this.velocity });
    }

}