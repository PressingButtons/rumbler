GameLib.Rumblers.Rumbler = class extends GameLib.Objects.RigidBody {


    constructor(width, height, body) {
        super(width, height, body);
        this.walk_forward_speed = 100;
        this.walk_backward_speed = 80;
        this.jumpHeight = 70;
    }

    jump( gravity ) {
        if(!this.land) return;
        this.velocity.y = -Math.pow((2 * gravity) * this.jumpHeight, 0.5); //square root -2 times acceleration times distance
    }

}