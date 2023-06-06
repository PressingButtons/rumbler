GameSystem.GameInstance = class extends Signaler {

    static GROUND_LEVEL = 527;
    static GRAVITY = 300;

    constructor(config) {
        super( );
        this.camera     = new GameLib.Components.Camera(816, 600);
        this.camera.scale = 0.6;
        this.camera.bottom = 600;
        this.stage      = new GameLib.Objects.StageObject('stage_summit');
        this.objects    = [ ];
        this.player1;
        this.player2;
        this.#initRoutes( );
        this.#initPlayers( config );
    }

    #initRoutes( ) {
        messenger.setRoute('input', this.#oninput.bind(this));
    }

    #initPlayers( config ) {
        this.player1 = new GameLib.Rumblers.Garf(358, 527);
        this.player1.right = 378;
        // =======================================================
        this.player2 = new GameLib.Rumblers.Garf(458, 527);
        this.player2.rotation.y = Math.PI;
        this.player2.left = 438;
        // =======================================================
        this.objects.push(this.player1, this.player2);
    }

    #createUpdateDetail( interval ) {
        return { 
            interval: interval, 
            seconds: interval * 0.001,
            objects: this.objects, 
            ground_level: GameSystem.GameInstance.GROUND_LEVEL, 
            gravity: GameSystem.GameInstance.GRAVITY
        }
    }

    #oninput( message ) {
        const speed = 0.8;
        const buttons = message.p1.buttons;
        if( buttons.left.active && !buttons.right.active ) {
            this.player1.velocity.x = -30;
            this.player1.rotation.y = Math.PI;
        }
        if( !buttons.left.active && buttons.right.active) {
            this.player1.rotation.y = 0;
            this.player1.velocity.x =  30;
        }

        if(buttons.up.active) this.player1.jump(GameSystem.GameInstance.GRAVITY)

        if(this.camera.right >= 816) this.camera.right = 816;
        if(this.camera.left <= 0)    this.camera.left  = 0;
        if(this.camera.bottom >= 600) this.camera.bottom = 600;
        if(this.camera.top < 0 ) this.camera.top = 0;
    }

    currentState( ) {
        return {
            camera: this.camera.rect,
            entries: [this.stage.pack( )].concat( this.objects.map( x => x.pack( )) )
        }
    }

    closeRoutes( )  {
        messenger.deleteRoute('input');
    }

    update( interval ) {
        const detail = this.#createUpdateDetail(interval);
        for(const object of this.objects) object.signal('update', detail);
        return this.currentState( );
    }
    
}
