importScripts('../webworker/webworker_messenger.js');
/**
 * Table of Contents
 * 01 Global Variables
 * ====================
 * 02 Class Definitions
 * -------------------- 
 *  :01 Sequence 
 *  :03 PlayerManager 
 *  :04 GameObject
 *  :05 Game
 *  :06 GameDatabase
 *  :07 Vector
 *  :rumbler 
 *  :rumbler:dummy
 * ====================
 * 03 Functions
 * --------------------
 *  :01 singleTextureData
 *  :02 paletteTextureData
 *  :03 spawn
 * ====================
 * 04 Routes
 * --------------------
 *  :01 Tilemaps
 *  :02 Game
 */

/** ========================================================================
 * Global Variables 
 ==========================================================================*/
let current_game = null;
const GRAVITY = 100, GROUND = 220, FRICTION = 0.5, STAGE_BOUNDS = { LEFT: -400, RIGHT: 400, BOTTOM: 240, TOP: -240};
const Tilemaps = { };

/** ========================================================================
 * (02) Class Definitions
 ===========================================================================*/

//(02:01) Sequence Class ------------------------------------------

class Sequence {

    #current_sequence_key;
    #subsequences = { };

    constructor( ) { }

    get current( ) {
        return this.#subsequences[this.#current_sequence_key];
    }

    #useSequence(name, options) {
        this.#current_sequence_key = name;
        switch(typeof this.current.value) {
            case 'function': this.current.value(options); break;
            case 'Sequence': this.current.value.scale(options); break;
        }
        return this;
    }

    //public methods 
    operate( ) {

    }

    register(name, sequence_value, transition_key = null) {
        this.#subsequences[name] = {name: name, value: sequence_value, transition_key: transition_key};
        if(sequence_value instanceof Sequence) sequence_value.parent = this;
        return this;
    }

    set(name, options) {
        if(this.#subsequences[name]) this.#useSequence(name, options);
        return this;
    }

    scale(options) {
        if(!this.current) return;
        this.operate(options);
        this.#useSequence(this.#current_sequence_key, options);
    }

    signal(name, options) {
        if(this.#subsequences[name])
            if(!this.current || this.current.transition_key == null || this.current.transition_key == name)
                this.#useSequence(name, options);
        return this;   
    }

}



// 02:03 PlayerManager ---------------------------------------------
class PlayerManager extends Sequence {

    #input_flags = {
        left: false, right: false, up: false, down: false, 
        guard: false, boost: false, attack: false, sub_attack: false, spec1: false, spec2: false, strafe: false};

    #rumbler;

    constructor(controller_index, rumbler) {
        super( );
        this.#rumbler = rumbler;
    }

    #flagExclusive(input, key1, key2) {
        let value = 0;
        if(input[key1]) value--;
        if(input[key2]) value++;
        this.#input_flags[key1] = (value < 0);
        this.#input_flags[key2] = (value > 0);
    }

    #flagDirectional(input) {
        this.#flagExclusive(input, 'left', 'right');
        this.#flagExclusive(input, 'up', 'down');
    }

    readInput(input) {
        Object.assign(this.#input_flags, input);
        this.#flagDirectional(input);
    }

    serialize( ) {
        return {
            input: this.#input_flags
        }
    }

}

// 02:04 GameObject -------------------------------------------------
class GameObject extends Sequence {

    constructor(width, height) {
        super( );
        this.position = new Vector( );
        this.velocity = new Vector( );
        this.rotation = new Vector( );
        this.size     = new Vector(width, height, 0);
    }

    get width( ) {return this.size[0]}
    get height( ) {return this.size[1]}

    get left( )   {return this.position.x - this.size.x * 0.5}
    set left(n)   {this.position.x = n + this.size * 0.5}

    get right( )  {return this.position.x + this.size.x * 0.5}
    set right(n)  {this.position.x = n - this.size * 0.5}

    get top( )    {return this.position.y - this.size.y * 0.5}
    set top(n)    {this.position.y = n - this.size.y * 0.5}

    get bottom( ) {return this.position.y + this.size.y * 0.5}
    set bottom(n) {this.position.y = n - this.size.y * 0.5}

    #move(seconds) {
        this.position.x += this.velocity.x * seconds;
        this.position.y += this.velocity.y * seconds;
    }

    operate(detail) {
        this.#move(detail.seconds);
    }

    serialize( ) {
        return {
            position: this.position.xyz,
            velocity: this.velocity.xyz,
            rotation: this.rotation.xyz,
            height: this.height,
            width: this.width
        }
    }

}
// 02:05 Game ----------------------------------------------------
class Game extends Sequence {

    #player1;
    #player2;
    #database;
    #camera;

    constructor(config) {
        super( );
        this.#database = new GameDatabase( );
        this.#camera = new GameObject(600, 320);
        /*
        this.#setPlayer(this.#player1, config.players[0]);
        this.#setPlayer(this.#player2, config.players[1]);
        */
    }

    //private

    #createHumanPlayer(controller_id, config) {
        const rumbler = createRumbler(config.type);
        const rumbler_id = this.#database.addRumbler(rumbler);
        const manager = new PlayerManager(controller_id, rumbler);
    }

    #managerDetails( ) {
        let details = {
            p1: this.#player1.serialize( ),
            p2: this.#player2.serialize( )
        }
        return;
    }

    #setPlayer(player, detail) {
        const parsed_type = detail.controller.split(':');
        if(parsed_type[0] == 'human') return this.#createHumanPlayer(parsed_type[1], detail);
    }

    #updateCamera( ) {
        let pos = centerPoint(...this.#player1.rumbler.position.xy, ...this.#player2.rumbler.position.xy);
        this.#camera.position.set(pos);
        this.#camera.top = Math.max(STAGE_BOUNDS.TOP, camera.top);
        this.#camera.left = Math.max(STAGE_BOUNDS.LEFT, camera.left);
        this.#camera.right = Math.min(STAGE_BOUNDS.RIGHT, camera.right);
        this.#camera.bottom = Math.min(STAGE_BOUNDS.BOTTOM, camera.bottom);
    }

    //public
    readInput(input) {

    }

    step(interval) {
        const detail = {interval: interval, seconds: interval * 0.01};
        detail.players = this.#managerDetails( );
    }

    serialize( ) {
        return {
            player1: this.#player1.serialize( ),
            player2: this.#player2.serialize( ),
            objects: this.#database.serialize( ),
            camera: this.#camera.serialize( )
        }
    }

}

// 02:06 GameDatabase --------------------------------------------
class GameDatabase {

    #enum = (function* ( ) {
        let i = 0; while(true) yield i++;
    })( );

    #rumblers = [ ];
    #particles = [ ];
    #objects =  {};

    constructor( ) {

    }

    addRumbler(rumbler) {
        const index = this.#enum.next( ).value;
        this.#objects[index] = rumbler; //serialization
        rumbler.push(rumbler); 
        rumbler.databse_id = index;
        return index;
    }

    serialize( ) {
        const serialization = { };
        for(const key in this.#objects) {
            const value = this.#objects[key];
            const rumbler_index = this.#rumblers.indexOf(value);
            if(rumbler_index > -1)  {
                serialization[key] = {type: 'rumbler', index: rumbler_index, detail: value.serialize( )};
                continue;
            } 
            const particle_index = this.#particles.index(value);
            if(particle_index > -1) {
                serialization[key] = {type: 'particle', index: particle_index, detail: value.serialize( )};
            }
        }
        return serialization;
    }

}

// 02:07 Vector -------------------------------------------------------
class Vector {

    #data = new Float32Array(3);

    constructor(x = 0, y = 0, z = 0) {
        this.#data.set([x, y, z]);
    }

    get x( ) {return this.#data[0]}
    set x(n) {this.#data[0] = n}

    get y( ) {return this.#data[1]}
    set y(n) {this.#data[1] = n}

    get z( ) {return this.#data[2]}
    set z(n) {this.#data[1] = n}

    get xy( ) {return this.#data.subarray(0, 3)}
    get xyz( ) {return this.#data}

    set(n) { this.#data.set(n); }

}

// Rumbler ------------------------------------------------------------
class Rumbler extends GameObject {

    constructor(config) {
        super(config.width, config.height);
        this.textures = [ ];
    }

}

// Rumbler:Dummy ------------------------------------------------------
class Dummy extends GameObject {

    constructor( ) {
        this.display_data = singleTextureData('placeholder');
    }

    operate(detail) {
        this.velocity.set([0, 0]);
        if(detail.left)  this.velocity.x = -5;
        if(detail.right) this.velocity.x =  5;
        if(detail.up)    this.velocity.y = -5;
        if(detail.down)  this.velocity.y =  5;
    }

    update(detail) {
        this.scale(detail);   
    }

    serialize( ) {
        Object.assign(GameObject.prototype.serialize.call(this), this.display_data);
    }

}

/** ========================================================================
 * (03) Functions
 ===========================================================================*/
 //03:01 singleTextureData
function singleTextureData(name, wrap_s = 'CLAMP_TO_EDGE', wrap_t = "CLAMP_TO_EDGE") {
    return {
        buffer: 'square', program: 'single-texture',
        texture: name, draw_method: 'TRIANGLE_STRIP',
        first_array: 0, indices: 4,
        wrap_s: wrap_s, wrap_t: wrap_t,
        tint: [1, 1, 1, 1]
    }
}

//03:02 paletteTextureData 
function paletteTextureData(name, w) {

}

//03:03 createRumbler
function createRumbler(type) {
    switch(type) {
        case 'dummy': return new Dummy( );
    }
}

//03:04 distance 
function centerPoint(x1, y1, x2, y2) {
    return [
        Math.min(x1, x2) + Math.abs(x2 - x1),
        Math.min(y1, y2) + Math.abs(y2 - y1)
    ]
}

 /**========================================================================
  * (04) Routes
===========================================================================*/

// 04:01 - maps route ----------------------------------------------------
// route set for gathering bimaps and converting into tilempas

//04:02 - game ---------------------------------------------------------
//creating a new game environment 
messenger.setRoute('game', function(message) {
    game = new Game(message);
    messenger.setRoute('input', game.readInput.bind(game));
});