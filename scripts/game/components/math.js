GameComponents.Math = { };

{

    //VECTORS 
    GameComponents.Math.Vector = class {

        /** @type {TypedArray} */
        #data = new Float32Array(3);
    
        constructor(data) {
            if(data instanceof Vector || data instanceof Array) this.set(data.xyz);
        }
    
        get x( ) {return this.#data[0]} 
        set x(n) {this.#data[0] = n}
    
        get y( ) {return this.#data[1]} 
        set y(n) {this.#data[1] = n}
    
        get z( ) {return this.#data[2]} 
        set z(n) {this.#data[2] = n}
    
        get xy( ) {return this.#data.subarray(0, 2)}
        get xyz( ) {return this.#data.subarray(0, 3)}
    
        add(vector) {
            this.x += vector.x;
            this.y += vector.y;
            this.z += vector.z;
        } 
    
        subtract(vector) {
            this.x -= vector.x;
            this.y -= vector.y;
            this.z -= vector.z;
        }
    
        set(n) {this.#data.set(n, 0)}
        
    }

}