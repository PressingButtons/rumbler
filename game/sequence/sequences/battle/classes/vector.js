const Vector = { };

Vector.Vector = class {

    constructor( typedArrayClass ) {
        this.data = new typedArrayClass( 3 );
    }

    get x( ) { return this.data[0] }
    set x(n) { this.data[0] = n }
    //==============================
    get y( ) { return this.data[1] }
    set y(n) { this.data[1] = n }
    //==============================
    get z( ) { return this.data[2] }
    set z(n) { this.data[2] = n }

    add( vector ) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
    }

    addScaled( vector, scalar ) {
        this.x += vector.x * scalar;
        this.y += vector.y * scalar;
        this.z += vector.z * scalar;
    }

    subtract( vector ) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.z -= vector.z;
    }

    scalarMultiply( num ) {
        this.x *= num;
        this.y *= num;
        this.z *= num;
    }

}
