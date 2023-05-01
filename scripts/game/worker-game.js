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
    #camera = {x: 0, y: 0, width: 576, height: 333}

    constructor(config) {
        super( );
        this.#init(config);
    }

    get step( ) {
        return this.#step;
    }

    #init( ) {
        this.database = new GameDatabase( );
        this.state_stack = new GameStateStack( );
        this.cache_instance = false;
        return this;
    }

    #setStep(num) {
        if(num) this.#step = num;
        else this.#step = 1 / 60;
    }

    #setInputDelay(num) {
        this.#input_delay = Math.max(0, num);
    }

    #setPlayers(players) {
        this.#player1 = this.#createPlayer(players[0], -200, 100);
        this.#player2 = this.#createPlayer(players[1],  200, 100);
    }

    #packageCamera() {
        const hw = this.#camera.width * 0.5;
        const hh = this.#camera.height * 0.5;
        //return [this.#camera.x - hw, this.#camera.x + hw, this.#camera.y + hh, this.#camera.y - hh];
        return [0, 800, 450, 0];
    }

    #createPlayer(detail, x, y) {
        //const rumbler = spawnRumbler(detail.rumbler);
        const rumbler = new Dummy(50, 90);
        rumbler.position.set([GAME_ORIGIN[0] + x, GAME_ORIGIN[1] + y, 0]);
        console.log(rumbler.position.xyz, origin);
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
        this.stop( );
    }

    init(config) {
        this.#setStep(config.frames_per_second);
        this.#setInputDelay(config.input_delay);
        this.#setPlayers(config.players);
    }

    handleInput(config) {
        if(!this.#player1) return;
        this.#player1.readInput(config);
        this.#player2.readInput(config);
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

    #input = {
        flags: { left: 0, right: 0, up: 0, down: 0, a: 0, b: 0, c: 0, d: 0},
        log: []
    }

    constructor(rumbler) {
        this.rumbler = rumbler;
    }

    readInput(input) {

    }


}