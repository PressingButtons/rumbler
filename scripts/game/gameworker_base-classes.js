class DataBuffer {

    #data; 
    #byte_offset = 0;

    constructor(size) {
        this.#data = new ArrayBuffer(size);
    };

    get allocated_bytes( ) {
        return this.#byte_offset;
    }

    get unallocated_bytes( ) {
        return this.#data.byteLength - this.#byte_offset;
    }

    createFloat32(size) {
        const buffer = new Float32Array(this.#data, this.#byte_offset, size * Float32Array.BYTES_PER_ELEMENT);
        this.#byte_offset += size * Float32Array.BYTES_PER_ELEMENT;
        if(this.#byte_offset % 2 == 1) this.#byte_offset ++;
        return buffer;
    }

    createInt8(size) {
        const buffer = new Int8Array(this.#data, this.#byte_offset, size * Int8Array.BYTES_PER_ELEMENT);
        this.#byte_offset += size * Int8Array.BYTES_PER_ELEMENT;
        if(this.#byte_offset % 2 == 1) this.#byte_offset ++;
        return buffer;
    }

    createInt16(size) {
        const buffer = new Int16Array(this.#data, this.#byte_offset, size * Int16Array.BYTES_PER_ELEMENT);
        this.#byte_offset += size * Int16Array.BYTES_PER_ELEMENT;
        if(this.#byte_offset % 2 == 1) this.#byte_offset ++;
        return buffer;
    }


}

class Vector {

    /** @type {TypedArray} */
    #data;

    constructor(float_array) {
        this.#data = float_array;
    }

    get x( ) {return this.#data[0]} 
    set x(n) {this.#data[0] = n}

    get y( ) {return this.#data[1]} 
    set y(n) {this.#data[1] = n}

    get z( ) {return this.#data[2]} 
    set z(n) {this.#data[2] = n}

    get xy( ) {return this.#data.subarray(0, 2)}
    get xyz( ) {return this.#data.subarray(0, 3)}

    set(n) {this.#data.set(n, 0)}


}

class GameObject extends EventObject {

    static #ENNUMERATOR = function*( ) {
        let index = 0;
        while(true) yield index++;
    }

    #id;
    #data_buffer;
    #position;
    #rotation;
    #scale;
    #texture = {source: null, palette: { source: null, index: 0 }}

    constructor(name, width, height, allocation = 128) {
        super( );
        this.#id = `gameobject:${GameObject.#ENNUMERATOR.next( ).value}:${name}`;
        this.#data_buffer = new DataBuffer(allocation);
        this.#scale    = new Vector(this.#data_buffer.createInt16(3));
        this.#position = new Vector(this.#data_buffer.createInt16(3));
        this.#rotation = new Vector(this.#data_buffer.createFloat32(3));
        this.#velocity = new Vector(this.#data_buffer.createFloat32(3));
        this.#scale.set([width, height, 1]);
    }

    get id( ) {return this.#id}

    get data_buffer( ) {return this.#data_buffer}

    get position( ) {return this.#position.xyz}
    get rotation( ) {return this.rotation.xyz}
    get scale( ) {return this.#scale.xyz}

    wrap( ) {
        return {
            position: this.#position.xyz,
            rotation: this.#rotation.xyz,
            scale   : this.#scale.xyz,
            texture : this.#texture.source,
            palette : this.#texture.palette.source,
            palette_index: this.#texture.palette.index
        }
    }
    
}

class Sequence extends EventObject {

    #name;
    #current;
    #sub_sequences = { };

    /**
     * 
     * @param {String} name 
     * @param {Function} enter 
     * @param {Function} exit 
     */
    constructor(name, enter, exit) {
        this.#name;
        this.enter = enter || function( ) { };
        this.exit = exit || function( ) { };
    }

    get current( ) {return this.#current;}

    #createListener(key) {
        const self = this;
        return function(event) {
            if(event.type != key || event.type == self.#current) return;
            if(self.#current) self.#sub_sequences[self.#current].sequence.exit(event.detail.on_exit);
            self.#sub_sequences[key].sequence.enter(event.detail.on_enter);
        }
    } 
 
    create(key, on_enter, on_exit) {
        const self = this;
        const sequence = new Sequence(key, on_enter, on_exit);
        const listener = this.#createListener(key);
        this.addEventListener(key, listener);
        this.#sub_sequences[key] = {sequence: sequence, listener: listener};
        sequence.parent = this;
        return sequence;
    }

    destroy(key) {
        this.removeEventListener(key, this.#sub_sequences[key].listener);
        delete this.#sub_sequences[key];
    }

    getSequence(key) {
        return this.#sub_sequences[key].sequence;
    }

    signal(key, on_enter, on_exit) {
        this.dispatchEvent(new CustomEvent(key, {detail: {
            on_enter: on_enter,
            on_exit: on_exit}
        }));
    }

}
