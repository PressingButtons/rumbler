{
    //==========================================
    // Declare Battle Namespace
    //==========================================
    self.Battle = {}
    //==========================================
    // Init Stage Detail
    //==========================================
    const Stage = {
        textures: ['summit'],
        position: [408, 300, 0],
        rotation: [0, 0, 0],
        tint: [1, 1, 1, 1],
        width: 816, height: 600,
        half_w: 408, half_h: 300,
        shader: 'single_texture',
    }
    //==========================================
    // Define Global Variables
    //==========================================
    let battle
    //==========================================
    // BattleInstance class
    //==========================================
    class BattleInstance extends SignalObject {

        static UPDATE_INTERVAL = 10;
        static STAGE_WIDTH = 816;
        static STAGE_HEIGHT = 600;
        static FLOOR = 527;
        static DEBUG = false;

        #interval_id;
        #elapsed_time = 0;

        constructor( config ) {
            super( );
            Camera.scale = 2;
            Camera.move( BattleInstance.STAGE_WIDTH / 2, BattleInstance.STAGE_HEIGHT - Camera._height / 2);
            this.#init( config );
            this.#setRoutes( );
            this.#play( );
        }

        #init( config ) {
            this.#initMeta( config );
            this.#initPlayers( config );
        }
        
        #initMeta( config ) {
            this.meta = {
                time: config.time,
                mode: config.mode,
            }
        }

        #initPlayers( config ) {
            this.player1 = createPlayer( config.player1 );
            this.player1.x = BattleInstance.STAGE_WIDTH / 2 - 50;
            this.player1.bottom = BattleInstance.FLOOR;
            this.player2 = createPlayer( config.player2 );
            this.player2.x = BattleInstance.STAGE_WIDTH / 2 + 50;
            this.player2.bottom = BattleInstance.FLOOR;
            this.player2.face_left( );
        }

        

        #onDEBUG( ) {
            messenger.send('ping');
            console.log('battle_system_ping', 'sent', Date.now( ));
        }

        #setRoutes( ) {
            messenger.listen('play', this.#play.bind( this ));
            messenger.listen('stop', this.#stop.bind( this ));
            messenger.listen('input', this.#oninput.bind(this));
        }

        #play( ) {
            this.#interval_id = setInterval( this.#update.bind(this), BattleInstance.UPDATE_INTERVAL );
        }

        #stop( ) {
            clearInterval(this.#interval_id);
        }

        #oninput( input ) {
            console.log( input );
        }

        #sendState( ) {
            const state = this.getBattleState( );
            messenger.send('state', state);
        }

        #update( ) {
            if(BattleInstance.DEBUG) this.#onDEBUG( );
            this.#sendState( );
        }

        //==========-----
        // Public Methods 
        //==========-----
        getBattleState( ) {
            const battle_state = { camera: Camera.rect, objects: [], meta: this.meta};
            battle_state.objects.push( Stage, this.player1.current_state( ), this.player2.current_state( ));
            return battle_state;
        }

    }
    //==========================================
    // Define Camera
    //==========================================
    const Camera = {

        x: 0,  y: 0, scale: 1,
        width: 800,
        height: 450,
    
        move: function( x, y ) {
            this.x = x; this.y = y;
        },
        
        get _height( ) {
            return this.height / this.scale;
        },

        get _width( ) {
            return this.width / this.scale;
        },
    
        get left( ) { return this.x - this.width * 0.5 / this.scale; },
        set left(n) { this.x = n + this.width * 0.5 / this.scale },
    
        get right( ) { return this.x + this.width * 0.5 / this.scale; },
        set right(n) { this.x = n - this.width * 0.5 / this.scale },
    
        get top( ) { return this.y - this.height * 0.5 / this.scale; },
        set top(n) { this.y = n + this.height * 0.5 / this.scale },
    
        get bottom( ) { return this.y + this.height * 0.5 / this.scale; },
        set bottom(n) { this.y = n - this.height * 0.5 / this.scale },

        get rect( ) {
            return { left: this.left, right: this.right, top: this.top, bottom: this.bottom }
        }
    
    }
    //==========================================
    // Creating a new Battle Instance 
    //==========================================
    Battle.create = config => {
        Battle.close( );
        battle = new BattleInstance( config );
    }
    //==========================================
    // Closing current Battle Instance
    //==========================================
    Battle.close = ( ) => {
        if( !battle ) return null;
    }
    //==========================================
    // Creating a Player Object
    //==========================================
    const createPlayer = config => {
        const player = new GameLib.Rumbler( config );
        return player;
    }
    //==========================================
    // 
    //==========================================
    //==========================================
    // 
    //==========================================
    //==========================================
    // 
    //==========================================
    //==========================================
    // 
    //==========================================
    //==========================================
    // 
    //==========================================

}