class DataBuffer {

    
    #data; /** @type {ArrayBuffer} */
    #offset = 0;
    #buffers

    constructor(size) {
        this.#data = new ArrayBuffer(size);
    }

    get bytes_total( ) {
        return this.#data.byteLength
    }

    get bytes_used( ) {
        return this.#data.byteLength - this.#offset
    }
    
    clear( ) {

    }

}
class Vector {

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

class DisplayInformation {

    constructor( ) {
        this.data  = {
            textures: { }, buffer: 'square', program: 'color',
            draw_method: 'TRIANGLES', tint: [1, 1, 1, 1], first_array: 0,
            indices: 4
        }
    }

    setTexture(name, wrap_s = "CLAMP_TO_EDGE", wrap_t = "CLAMP_TO_EDGE") {
        this.data.textures[name] = {rect: [0, 0, 1, 1], wrap_s: wrap_s, wrap_t: wrap_t};
    }

}

class GameObject extends Sequence {

    constructor(config) {
        this.position = new Vector( );
        this.velocity = new Vector( );
        this.rotation = new Vector( );
        this.width = config.width || 1;
        this.height = config.height || 1;
        this.display_information = new DisplayInformation( );
    }

    resolveTilemap(tilemap) {

    }

    dump( ) {
        return Object.assign({
            position: this.position.xyz, 
            velocity: this.position.xyz, 
            rotation: this.position.xyz,
            height: this.height,
            width: this.width,
        }, this.display_information.data)
    }

}

class Sequence {

    #current;
    #states = { };

    constructor( ) {

    }

    get current( ) {
        return this.#states[this.#current];
    }

    #switchCurrent(name, options) {
        const from = this.#states[this.#current].from;
        if(from == null || from == name) this.#useState(name, options);
    }

    #useState(name, options) {
        this.#current = name;
        const value = this.#states[name].value;
        switch(typeof value) {
            case 'function': value(options); break;
            case 'Sequence': value.scale(options);
        }
    }

    register(name, value, from_key = null) {
        this.#states[name] = {name: name, from: from_key, value: value}
        if(typeof value == 'Sequence') value.parent = this;
    }

    set(name, options = { }) {
        if(this.#states[name]) this.#useState(name, options);
    }

    signal(name, options) {
        if(!this.#states[name]) return;
        if(this.#current) this.#switchCurrent(name, options);
        else this.#useState(name, options);
    }

    scale(options) {
        if(!this.#current) return;
        this.operate(options);
        this.#useState(this.#current, options);
    }

    operate( ) {

    }

}