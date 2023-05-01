/** ========================================================================
 * Global Variables 
 ==========================================================================*/
 let current_game = null;
 const GRAVITY = 100, GROUND = 220, FRICTION = 0.5, STAGE_BOUNDS = { LEFT: -400, RIGHT: 400, BOTTOM: 240, TOP: -240};
 
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

/** ========================================================================
 * Game
 * -------
 * Base Class for all Gamemodes 
 ==========================================================================*/
 class Game extends SignalObject {

    #step;
    #input_delay;

    constructor(config) {
        super( );
        this.#init(config);
    }

    #init(config) {
        this.#initSettings(config);
        this.database = new GameDatabase( );
        this.state_stack = new GameStateStack( );
        this.player1 = new PlayerManager(config.player1);
        this.player2 = new PlayerManager(config.player2);
    }

    #initSettings(config) {
        this.#step = 1 / config.frames_per_second;
    }


    #createInstance(interval) {
        const db = this.database.update({interval: this.#step, db: this.database});

    }

    #loop( ) {
        const instance = this.#createInstance(this.#step);         
    }

    handleInput(config) {

    }

    stop( ) {

    }

    play( ) {
        this.interval_id = setInterval(this.#loop.bind(this), 10);
    }

 }

  /** ========================================================================
 * GameDatabase
 * -------
 * Manages all action objects within a Game
 ==========================================================================*/
 class GameDatabase {

    #data = {
        actors: [],
        over_particles: [],
        under_particles: [ ]
    }

    constructor( ) {

    }

    get objects( ) {
        return [].concat.apply([], this.#data);
    }

    #updateParticles(config) {

    }

    #updateActors(config) {
        const options = Object.assign({actors: this.#data.actors}, config);
        for(const actor of this.#data.actors) actor.update(options);
    }

    #serialize( ) {
        return {
            actors: this.#data.actors.map(x => x.serialize()),
            over_particles: this.#data.over_particles.map(x => x.serialize ()),
            under_particles: this.#data.under_particles.map(x => x.serialize ()),
        }
    }

    /**
     * 
     * @param {ActionObject} object 
     */
    insert(object) {
        if(object instanceof Rumbler) this.#data.actors.push(object);
    }

    update(config) {
        this.#updateParticles(config);
        this.#updateActors(config);
        return this.#serialize( );
    }

 }

 class GameStateStack {

    #cached = { };

    constructor( ) {
        this.stack = [];
    }

    set(timestamp, instance, cache = false) {
        
        if(cache) this.#cached[timestamp] = instance;
    }

    get(timestamp) {
        return this.#cached[timestamp];
    }

    next( ) {
        return this.stack.shift( );
    }

 }

  /** ========================================================================
 * PlayerManager
 * -------
 * Represents a player entity and manages a targeted Rumbler Object
 ==========================================================================*/
class PlayerManager {

    constructor() {

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
        this.display = {shader: 'single', texture: null, rect: [0, 0, this.width, this.height]}
    }

    get width( ) {return this.size[0]}
    set width(n) {this.size[0] = Math.min(n, 1)}

    get height( ) {return this.size[1]}
    set height(n) {this.size[1] = Math.min(n, 1)}

    get bottom( ) {return this.position.y + this.height * 0.5}
    set bottom(n) {this.position.y = n - this.height * 0.5}

    get left( )   {return this.position.x - this.width * 0.5}
    set left(n)   {this.position.x = n + this.width * 0.5}

    get right( )  {return this.position.x + this.width * 0.5}
    set right(n)  {this.position.x = n - this.width * 0.5}
    
    get top( )    {return this.position.y - this.height * 0.5}
    set top(n)    {this.position = n + this.height * 0.5}

    static serialize( ) {
        return {
            position: this.position.xyz,
            rotation: this.rotation.xyz,
            size:     this.size
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
        this.body = config.body || {width: this.width, height: this.height};
        this.velocity = new Vector( );
    }

    get left( )     {return this.position.x - this.body.width * 0.5}
    set left(n)     {this.position.x = n + this.body.width * 0.5}
    
    get right( )    {return this.position.x + this.body.width * 0.5}
    set right(n)    {this.position.x = n - this.body.width *0.5}

    get top( )      {return this.position.y - this.body.height * 0.5}
    set top(n)      {this.position.y = n + this.body.height * 0.5}

    get bottom( )   {return this.position.y + this.body.height * 0.5}
    set bottom(n)   {this.position.y = n - this.body.height * 0.5}

    static serialize( ) {
        return Object.assign(GameObject.serialize.call(this), {
            body: this.body, 
            texture: this.texture,
            velocity: this.velocity.xyz,
        });
    }

    move(seconds) {
        this.position.add(this.velocity, seconds);
    }
    
    update( ) { }

}

/** ========================================================================
 * Rumbler
 * -------
 * Base class of all fighting character objects within the gamespace
 ==========================================================================*/
class Rumbler extends ActionObject {
    
    constructor(config) {
        super(config);
        this.#setHooks( );
    }

    #setHooks( ) {
        this.setHook('ground', this.#onGround.bind(this));
        this.setHook('aerial', this.#inAir.bind(this));
    }

    #onGround(config) {
        if(this.velocity.x != 0) this.velocity.x *= FRICTION * config.seconds; 
        if(Math.abs(this.velocity.x) < FRICTION) this.velocity.x = 0;
    }

    #inAir(config) {
        this.velocity.y += config.seconds * GRAVITY;
    }

    update(config) {
        this.move(config.seconds);
        if(this.bottom >= GROUND) this.signal('ground', config);
        else this.signal('aerial', config);
    }

    serialize( ) {
        return Object.assign(ActionObject.serialize.call(this), { });
    }

}

/** ========================================================================
 * Dummy
 * -------
 * Testing Object simulating a basic Action Object
 ==========================================================================*/
class Dummy extends ActionObject {
    
    constructor(width, height){
        super({width: width, height: height});
        this.#setHooks( );
    }

    #setHooks( ) {
        this.setHook('left', this.#left.bind(this));
        this.setHook('right', this.#right.bind(this));
        this.setHook('up', this.#up.bind(this));
        this.setHook('down', this.#down.bind(this));
    }

    #left(options) {
        this.velocity.x = -5 * options.seconds;
    }

    #right(options) {
        this.velocity.x =  5 * options.seconds;
    }

    #up(options) {
        this.velocity.y = -5 * options.seconds;
    }

    #down(options) {
        this.velocity.y = +5 * options.seconds;
    }

    update(options) {
        if(options.input.up)  this.#up(options);
        if(options.input.down)  this.#down(options);
        if(options.input.left)  this.#left(options);
        if(options.input.right) this.#right(options);
    }

}

/** ========================================================================
 * DummyRumbler
 * -------
 * Testing Object simulating a basic Rumbler Object
 ==========================================================================*/
 class DummyRumbler extends Rumbler {

    constructor(config) {
        super(config);
    }

 }

 