GameLib.Rumblers.Garf = class extends GameLib.Rumblers.Rumbler {

    constructor(x, y) {
        super(96, 96, {x: 35, y: 31, width: 26, height: 49});
        this.textures.push('garf');
        this.position.x = x; this.position.y = y;
    }

}