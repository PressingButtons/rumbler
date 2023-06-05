GameLib.GameObject = class extends Signaler {

    constructor(width, height) {
        super( );
        this.velocity = new GameComponents.Math.Vector( );
        this.position = new GameComponents.Math.Vector( );
        this.rotation = new GameComponents.Math.Vector( );
        this.width = Math.max(width, 1);
        this.height = Math.max(height, 1);
        this.textures = [ ];
    }

    reduce( ) {
        return {
            shader_type: 'texture',
            textures: this.textures,
            velocity: this.velocity.xyz,
            position: this.position.xyz,
            rotation: this.rotation.xyz,
            width: this.width,
            height: this.height
        }
    }

}