const System = class extends Objects.Sequencer {

    constructor( ) {
        super( );
        this.world = new Components.World( );
        this.camera = new Components.Camera;
        this.runid;
    }

    #buildObjects( config ) {
        if( !config.mobs ) return;
        for( const object of config.mobs ) {

        }
    }

    #buildPlayer( player_data, config ) {
        const player = new Components.PlayerManager( player_data, config );
        this.world.setObject( player.rumbler );
        return player;
    }

    #buildPlayers( config ) {
        this.players = [ ];
        this.players.push( this.#buildPlayer( config.player1, config ));
        if( config.player2 ) this.players.push( this.#buildPlayer( config.player2, config ));
        this.camera.track(this.players.map( x => x.rumbler));
        this.#posiitonPlayers( );
    }

    #createInstance( objects ) {
        return {
            camera: this.camera.rect,
            objects: objects
        }
    }

    #oninput( message ) {
        for(const player of this.players)
            player.readInput( message.content );
    }

    #posiitonPlayers( ) {
        for( const player of this.players ) {
            player.rumbler.bottom = Components.World.FLOOR;
        }
        if( this.players.length == 2 ) {
            this.players[0].rumbler.right = -100;
            this.players[1].rumbler.left  = 100;
            this.players[1].rumbler.rotation.y = Math.PI;
        }
    }

    init( config  ) {
        this.world.init( config );
        this.#buildPlayers( config );
        this.#buildObjects( config );
        Messenger.setRoute('input', this.#oninput.bind(this));
        return this.update( 0 );
    }

    async close( ) {
    
    }

    run( ) {
        clearInterval( this.runid );
        this.runid = setInterval( interval => {
            const instance = this.update( interval );
            Messenger.sendMessage('instance', JSON.stringify(instance))
        }, 10, 10);
    }

    update( ms ) {
        const objects = this.world.update( ms, this.camera );
        return this.#createInstance(objects);
    }

}