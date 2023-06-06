GameLib.Rumblers.Rumbler = class extends GameLib.Objects.RigidBody {


    constructor(width, height, body) {
        super(width, height, body);
        this.walk_forward_speed = 100;
        this.walk_backward_speed = 80;
        this.jumpHeight = 30;
    }

    jump( gravity ) {
        if(!this.land) return;
        this.velocity.y = -(2 * gravity * 0.0167) * this.jumpHeight;
    }

}