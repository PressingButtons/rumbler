/** ========================================================================
 * Game Constants
 ==========================================================================*/
const GAME_ORIGIN = [400, 225, 0]

/** ========================================================================
 * Game
 * -------
 * Base Class for all Gamemodes 
 ==========================================================================*/
 class Game extends SignalObject {

    #step;
    #input_delay;
    #player1;
    #player2;
    #camera = {x: 0, y: 50, width: 800, height: 450, scale: 1.8}

    constructor( ) {
        super( );
        this.database = new GameDatabase( );
        this.state_stack = new GameStateStack( );
        this.cache_instance = false;
    }

    get seconds( ) {
        return this.#step;
    }

    #setStep(num) {
        if(num) this.#step = 1 / num;
        else this.#step = 1 / 60;
    }

    #setInputDelay(num) {
        this.#input_delay = Math.max(0, num);
    }

    #setPlayers(players) {
        this.#player1 = this.#createPlayer(players[0], -90, -100);
        this.#player2 = this.#createPlayer(players[1],  90, 100);
    }

    #packageCamera() {
        const x = GAME_ORIGIN[0] + this.#camera.x;
        const y = GAME_ORIGIN[1] + this.#camera.y;
        const w = this.#camera.width / this.#camera.scale;
        const h = this.#camera.height / this.#camera.scale;
        return [
            x - w * 0.5, x + w * 0.5, y + h * 0.5, y - h * 0.5
        ]
        //return [this.#camera.x - hw, this.#camera.x + hw, this.#camera.y + hh, this.#camera.y - hh];
        return [0, 800, 450, 0];
    }

    #createPlayer(detail, x, y) {
        //const rumbler = spawnRumbler(detail.rumbler);
        const rumbler = new DummyRumbler(50, 90);
        rumbler.position.set([GAME_ORIGIN[0] + x, GAME_ORIGIN[1] + y, 0]);
        const manager = new PlayerManager(rumbler);
        this.database.add(rumbler);
        return manager;
    }

    #createInstance( ) {
        return {
            objects: this.database.update(this),
            camera: this.#packageCamera( )
        }
    }

    #loop( ) {
        this.cache_instance = false;
        const instance = this.#createInstance( );
        messenger.send('game-instance', instance)
    }

    init(config) {
        this.#setStep(config.frames_per_second);
        this.#setInputDelay(config.input_delay);
        this.#setPlayers(config.players);
    }

    handleInput(config) {
        if(!this.#player1) return;
        this.#player1.readInput(config.p1);
        this.#player2.readInput(config.p2);
    }

    stop( ) {
        clearInterval(this.interval_id);
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
    add(object) {
        if(object instanceof ActionObject) this.#data.actors.push(object);
    }

    update(game) {
        const config = {database: this, seconds: game.seconds}
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

    #input = { };
    #log = []

    constructor(rumbler) {
        this.rumbler = rumbler;
        rumbler.buttons = this.#input;
    }

    #clearButtons( ) {
        for(let key in this.#input) this.#input[key] = 0;
    }

    #parseInput(input) {
        Object.assign(this.#input, input); 
        if(this.#input.left && this.#input.right) this.#input.left = this.#input.right = 0;
        if(this.#input.up   && this.#input.down) this.#input.down  = this.#input.up    = 0;
    }
    
    readInput(input) {
        this.#clearButtons( );
        this.#parseInput(input);
        
    }


}