GameLib.Objects.GameObject = class extends Signaler {

    constructor(width, height) {
        super( );
        this.velocity = {x: 0, y: 0, z: 0};
        this.position = {x: 0, y: 0, z: 0};
        this.rotation = {x: 0, y: 0, z: 0}
        this.width = Math.max(width, 1);
        this.height = Math.max(height, 1);
        this.tint = [1, 1, 1, 1];
        this.textures = [ ];
        this.setRoute('move', this.#movement.bind(this));
    }

    #movement( config ) {
        const seconds = config.seconds;
        this.position.x += this.velocity.x * seconds;
        this.position.y += this.velocity.y * seconds;
    }

    pack( ) {
        return {
            shader_type: 'single_texture',
            textures: this.textures,
            velocity: Object.values(this.velocity),
            position: Object.values(this.position),
            rotation: Object.values(this.rotation),
            tint: this.tint,
            width: this.width, height: this.height
        }
    }

}