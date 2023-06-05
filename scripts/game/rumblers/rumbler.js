GameLib.Rumblers.Rumbler = class extends GameLib.Objects.RigidBody {


    constructor(width, height, body) {
        super(width, height, body);
        this.walk_forward_speed = 100;
        this.walk_backward_speed = 80;
        this.jumpHeight = 160;
    }

    jump( config ) {
        this.velocity.y = -(2 * config.gravity) * this.jumpHeight;
    }

}