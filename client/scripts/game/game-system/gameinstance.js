GameSystem.GameInstance = class extends Signaler {

    static GROUND_LEVEL = 527;
    static GRAVITY = 500;

    constructor(config) {
        super( );
        this.camera     = new GameLib.Components.Camera(816, 600);
        this.camera.scale = 0.4;
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
            gravity: GameSystem.GameInstance.GRAVITY,
            p1: this.player1,
            p2: this.player2
        }
    }

    #oninput( message ) {
        const buttons = message.p1.buttons;
        this.player1.input.left =   ( buttons.left.active && !buttons.right.active );
        this.player1.input.right =  (!buttons.left.active && buttons.right.active );
        this.player1.input.up =     ( buttons.up.active );
        this.player1.input.down =   ( buttons.down.active )
    }

    #repositionCamera( ) {
        const midpoint = Calc.Midpoint( this.player1.position, this.player2.position );
        Object.assign( this.camera.position, midpoint );
        this.#resolveCameraBounds(0, 0, 816, 600);
        
    }

    #resolveCameraBounds( left, top, right, bottom ) {
        if(this.camera.top < top)        this.camera.top = top;
        if(this.camera.left <= left)     this.camera.left  = left;
        if(this.camera.right >= right)   this.camera.right = right;
        if(this.camera.bottom >= bottom) this.camera.bottom = bottom;
    }

    #resolveCameraScale( ) {
        const distance = Calc.Distance( this.player1.position, this.player2.position );
        let scale = Math.min( 1, distance / 500 );
        scale = Math.max( 0.4, scale);
        this.camera.scale = scale;
    }

    #resolveCamera( ) {
        this.#resolveCameraScale( );
        this.#repositionCamera( );
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
        this.#resolveCamera( );
        return this.currentState( );
    }
    
}
