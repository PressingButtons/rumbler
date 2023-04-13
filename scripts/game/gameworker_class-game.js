class Game extends EventObject {

    #players = new Array(4).fill(new Player( ));
    #match_time;
    #world;

    constructor(config) {
        super( );
        this.#match_time = config.match_time;
        this.#world = new World( );
        for(const player in config.players) this.#players.activate(player);
    }

    get match_time( ) {
        return Math.ceil(this.#match_time * 0.001);
    }

    readInput(config) {

    }

    setInstance(instance) {

    }

    step(time) {
        const instance = { };
        instance.objects = this.#world.update(time);
        instance.match_time = this.#match_time;
        messenger.send('game-instance', instance);
        this.#match_time -= time;
    }

    stop( ) {

    }

    start( ) {

    }

}