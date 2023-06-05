GameLib.Components.Camera = class {

    #width = 800;
    #height = 450

    constructor( ) {
        this.scale = 1;
        this.position = { x: this.width * 0.5, y: this.height * 0.5 }; //start at origin
        this.scale = 0.5;
        this.bottom = 580;
    }

    get width( ) {
        return this.#width * this.scale;
    }

    get height( ) {
        return this.#height * this.scale;
    }

    get left( ) {
        return this.position.x - this.width * 0.5;
    }

    set left(n) {
        this.position.x = n + this.width * 0.5;
    }

    get right( ) {
        return this.position.x + this.width * 0.5;
    }

    set right(n) {
        this.position.x = n - this.width * 0.5; 
    }

    get top( ) {
        return this.position.y - this.height * 0.5;
    }

    set top(n) {
        this.position.y = n + this.height * 0.5;
    }

    get bottom( ) {
        return this.position.y + this.height * 0.5;
    }
    
    set bottom(n) {
        this.position.y = n - this.height * 0.5;
    }

    get rect( ) {
        return {left: this.left, right: this.right, top: this.top, bottom: this.bottom}
    }

}