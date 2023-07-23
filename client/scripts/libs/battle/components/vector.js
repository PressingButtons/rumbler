Component.Vector = class {

    constructor(  ) {
        this.data = new Float32Array(3);
    }

    get x( ) {return this.data[0]}; 
    set x(n) {this.data[0] = n}

    get y( ) {return this.data[1]}; 
    set y(n) {this.data[1] = n}

    get z( ) {return this.data[2]}; 
    set z(n) {this.data[2] = n}

    //===========================================================
    // Public Methods
    //===========================================================
    add( vector ) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
    }

    subtract( vector ) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
    }

    scalarMultiplication( num ) {
        this.data.forEach( x => x *= num );
    }

    scaled( num ) {
        return { 
            x: this.x * num, 
            y: this.y * num, 
            z:  this.z* num
        }
    }

}