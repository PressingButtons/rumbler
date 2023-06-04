class GameObject extends EventTarget {

    constructor( ) {
        super( );
        this.velocity = new GameComponents.Math.Vector( );
        this.position = new GameComponents.Math.Vector( );
        this.rotation = new GameComponents.Math.Vector( );
    }

    reduce( ) {
        return {
            shader_type: 'texture',
            textures: [''],
            velocity: this.velocity.xyz,
            position: this.position.xyz,
            rotation: this.rotation.xyz,
        }
    }

}