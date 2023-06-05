GameLib.StageObject =  class extends GameLib.GameObject {

    constructor(stage_name) {
        super(816, 600);
        this.position.x = 408;
        this.position.y =  300;
        this.textures = [stage_name];
    }

}