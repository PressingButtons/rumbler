GameLib.Objects.StageObject =  class extends GameLib.Objects.GameObject {

    constructor(stage_name) {
        super(816, 600);
        this.position.x = this.width * 0.5;
        this.position.y = this.height * 0.5;
        this.textures = [stage_name];
    }

}