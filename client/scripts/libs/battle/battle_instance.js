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
        static GRAVITY = 2000;

        #interval_id;
        #elapsed_time = 0;

        constructor( config ) {
            super( );
            Camera.scale = 1.5;
            Camera.move( BattleInstance.STAGE_WIDTH / 2, BattleInstance.STAGE_HEIGHT - Camera._height / 2);
            this.#init( config );
            this.#setRoutes( );
            this.#play( );
        }

        #init( config ) {
            this.#initMeta( config );
            this.#initPlayers( config );
            this.objects = [ ];
            this.cnt1 = new ControllerObject( );
            this.cnt2 = new ControllerObject( );
        }
        
        #initMeta( config ) {
            this.meta = {
                time: config.time,
                mode: config.mode,
            }
        }

        #initPlayers( config ) {
            this.player1 = createPlayer( config.player1 );
            this.player1.position.x = BattleInstance.STAGE_WIDTH / 2 - 50;
            this.player1.bottom = BattleInstance.FLOOR;
            this.player2 = createPlayer( config.player2 );
            this.player2.position.x = BattleInstance.STAGE_WIDTH / 2 + 50;
            this.player2.bottom = BattleInstance.FLOOR;
            this.player2.turnLeft( );
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
            parseInput( this.cnt1, input.cnt1 );
            parseInput( this.cnt2, input.cnt2 );
        }

        #sendState( ) {
            const state = this.getBattleState( );
            messenger.send('state', state);
        }

        #update( ) {
            if(BattleInstance.DEBUG) this.#onDEBUG( );
            this.#updatePlayers( );
            this.#sendState( );
        }

        #updatePlayers( ) {
            this.player1.update({ 
                opponent: this.player2, 
                objects: this.objects, 
                interval: BattleInstance.UPDATE_INTERVAL / 1000, 
                gravity: BattleInstance.GRAVITY, 
                floor: BattleInstance.FLOOR,
                control: this.cnt1
            });
            this.player2.update({ 
                opponent: this.player1, 
                objects: this.objects, 
                interval: BattleInstance.UPDATE_INTERVAL / 1000, 
                gravity: BattleInstance.GRAVITY, 
                floor: BattleInstance.FLOOR,
                control: this.cnt2
            });
        }

        //==========-----
        // Public Methods 
        //==========-----
        getBattleState( ) {
            const battle_state = { camera: Camera.rect, objects: [], meta: this.meta};
            battle_state.objects.push( Stage, this.player1.current_state, this.player2.current_state);
            return battle_state;
        }

    }
    //==========================================
    // Define Camera
    //==========================================
    const Camera = {

        x: 0,  y: 0, scale: 1,
        width: 816,
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
        //const player = new Rumbler.Instance( config );
        const player = new GameObject.Rumbler( config );
        return player;
    }
    //==========================================
    // Parse Input 
    //==========================================
    const parseInput = ( cnt, ar ) => {
        for(const key in cnt.buttons) {
            if( ar.indexOf(key) != -1 ) {
                cnt.press(key);
            } else {
                cnt.release( key );
            }
        }

        if( cnt.isPressed('left') && cnt.isPressed('right') ) {
            cnt.release('left');
            cnt.release('right');
        }

        if( cnt.isPressed('up') && cnt.isPressed('down')) {
            cnt.release('up');
            cnt.release('down');
        }

    }
    //==========================================
    // Controller Objects
    //==========================================
    class ControllerObject {

        constructor( ) {
            this.#setupButtons( );
        }

        #setupButtons( ) {
            this.buttons = {
                up: { value: 0, registered: 0},
                down: { value: 0, registered: 0},
                left: { value: 0, registered: 0},
                right: { value: 0, registered: 0},
                jump: { value: 0, registered: 0},
                guard: { value: 0, registered: 0},
                light: { value: 0, registered: 0},
                strong: { value: 0, registered: 0},
                special: { value: 0, registered: 0}
            }
        }

        isPressed( name ) {
            return this.buttons[name].value == 1;
        }

        isRegistered( name ) {
            return this.buttons[name].registered == 1;
        }

        register( name ) {
            if( this.buttons[name]) this.buttons[name].registered = 1;
        }

        unregister( name ) {
            if( this.buttons[name] ) this.buttons[name].registered = 0;
        }

        press( name ) {
            if( this.buttons[name] ) this.buttons[name].value = 1;
        }

        release( name ) {
            if( !this.buttons[name] ) return;
            this.buttons[name].value = 0;
        }

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

}
