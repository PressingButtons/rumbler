/** ========================================================================
 * Global Variables 
 ==========================================================================*/
 const GRAVITY = 1000, GROUND = 380, FRICTION = 0.5, STAGE_BOUNDS = { LEFT: -400, RIGHT: 400, BOTTOM: 240, TOP: -240};

 
/** ========================================================================
 * Signal Object 
 ==========================================================================*/
class SignalObject {

    #hooks = { };

    constructor( ) {

    }

    /**
     * 
     * @param {String} key 
     * @param {Function} method 
     * Sets key to contain methods that will be executed on signal
     */
    setHook(key, method) {
        if(!this.#hooks[key]) this.#hooks[key] = [];
        this.#hooks[key].push(method);
    }

    /**
     * 
     * @param {String} key 
     * @param {object} options 
     * @returns {void}
     * executes all functions associated with key with options
     */
    signal(key, options) {
        const hook = this.#hooks[key];
        if(!hook) return;
        for(const method of hook) method(options);
    }

}

class Rect {

    constructor(x, y, width, height) {

        this.point = new Point(x, y); 
        this.width = width;
        this.height = height;
    }
    

    get top( ) {return this.point.y - this.height * 0.5}
    set top(n) {this.point.y = n + this.height * 0.5}

    get left( ) {return this.point.x - this.width * 0.5}
    set left(n) {this.point.x = n + this.width * 0.5}

    get right( ) {return this.point.x + this.width * 0.5}
    set right(n) {this.point.x = n - this.width * 0.5}

    get bottom( ) {return this.point.y + this.height * 0.5}
    set bottom(n) {this.point.y = n - this.height * 0.5 }

    get top_left( ) {return new Point(this.left, this.top)}

    set top_left(point) {
        if(point.x || point[0]) this.point.set(point);
    }

    set(value) {
        if(value.x && value.y && value.width, value.height) {
            this.point.set(value);
            this.width = value.width;
            this.height = value.height;
        } else if(value.point && value.width && value.height) {
            this.point.set(point);
            this.width = value.width;
            this.height = value.height;
        }
    }

}

class Point {

    constructor(x, y) {
        this.x = x; 
        this.y = y;
    }

    set(value) {
        if(value.x && value.y) {
            this.x = value.x;
            this.y = value.y;
        } else if (value instanceof Array && value.length > 1) {
            this.x = value[0];
            this.y = value[1];
        }
    }

}

class Vector {

    #data = new Float32Array(3);

    constructor(x = 0, y = 0, z = 0) {
        if(x instanceof Array) this.set(x);
        else this.set([x, y, z]); 
    }

    get x( ) {return this.#data[0]}
    set x(n) {this.#data[0] = n}

    get y( ) {return this.#data[1]}
    set y(n) {this.#data[1] = n}

    get z( ) {return this.#data[2]}
    set z(n) {this.#data[2] = n}

    get xy( ) {return this.#data.subarray(0, 3)}

    get xyz( ) {return this.#data.subarray(0, 4)}

    #operate(vector, operator, factor = 1) {
        const values = vector.xyz;
         for(let i = 0; i < 3; i++) {
            switch(operator) {
                case '+' : this.#data[i] += values[i] * factor; break;
                case '-' : this.#data[i] -= values[i] * factor;  break;
                case '/' : this.#data[i] /= values[i] * factor; break;
                case '*' : this.#data[i] *= values[i] * factor; break;
            }
         }
        return this;
    }

    set(array) {
        this.#data.set(array);
    }

    add(vector, factor = 1) {
        return this.#operate(vector, '+', factor);
    }

    subtract(vector, factor = 1) {
        return this.#operate(vector, '-', factor);
    }

    multiply(vector, factor = 1) {
        return this.#operate(vector, '*', factor);
    }

    divide(vector, factor = 1) {
        return this.#operate(vector, '/', factor);
    }

}


/**=========================================================================
 * createRumbler
 * @param {String} name
 * @returns {Rumber} 
 * //creates a new rumbler object
 =========================================================================*/
function createRumbler(name) {
    switch(name) {
        case 'dummy': return new Dummy( );
        case 'dummy:rumbler': return new DummyRumbler( );
    }
}


/** ========================================================================
 * Game Object 
 * -------------
 * Root class of all items featured within the gamespace
 ==========================================================================*/
class GameObject extends SignalObject {

    constructor(width, height) {
        super( );
        this.position = new Vector( );
        this.rotation = new Vector( );
        this.size = new Vector( );
        this.width = width;
        this.height = height;
        this.display = {shader: 'single', texture: null, rect: null}
    }

    get width( ) {return this.size[0]}
    set width(n) {this.size[0] = Math.max(n, 1)}

    get height( ) {return this.size[1]}
    set height(n) {this.size[1] = Math.max(n, 1)}

    get bottom( ) {return this.position.y + this.height * 0.5}
    set bottom(n) {this.position.y = n - this.height * 0.5}

    get left( )   {return this.position.x - this.width * 0.5}
    set left(n)   {this.position.x = n + this.width * 0.5}

    get right( )  {return this.position.x + this.width * 0.5}
    set right(n)  {this.position.x = n - this.width * 0.5}
    
    get top( )    {return this.position.y - this.height * 0.5}
    set top(n)    {this.position = n + this.height * 0.5}

    serialize( ) {
        return {
            position: this.position.xyz,
            rotation: this.rotation.xyz,
            size:     this.size,
            display: this.display
        }
    }
}

/** ========================================================================
 * Action Object 
 * -------------
 * Root class of all items featured within the gamespace
 ==========================================================================*/
class ActionObject extends GameObject {

    constructor(config) {
        super(config.width, config.height);
        this.velocity = new Vector( );
        this.#createBody(config);
    }

    get left( )     {return this.position.x - this.body.width * 0.5}
    set left(n)     {this.position.x = n + this.body.width * 0.5}
    
    get right( )    {return this.position.x + this.body.width * 0.5}
    set right(n)    {this.position.x = n - this.body.width *0.5}

    get top( )      {return this.position.y - this.body.height * 0.5}
    set top(n)      {this.position.y = n + this.body.height * 0.5}

    get bottom( )   {return this.position.y + this.body.height * 0.5}
    set bottom(n)   {this.position.y = n - this.body.height * 0.5}

    #createBody(config) {
        this.body = new Rect(0, 0, this.width, this.height);
        if(config.body) this.body.set(config.body);
    }

    serialize( ) {
        return Object.assign(GameObject.prototype.serialize.call(this), {
            body: this.body, 
            velocity: this.velocity.xyz,
        });
    }

    move(seconds) {
        this.position.add(this.velocity, seconds);
    }

    collisionCheck(object) {
           
        return false;
    }
    
    update( ) { }

}
