GameSystem.GameInstance = class extends Signaler {

    static GROUND_LEVEL = 527;
    static GRAVITY = 100;

    constructor(config) {
        super( );
        this.camera     = new GameLib.Components.Camera( );
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
        this.player1 = new GameLib.Rumblers.Garf(350, 400);
        // =======================================================
        this.player2 = new GameLib.Rumblers.Garf(450, 400);
        this.player2.rotation.y = Math.PI;
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
        if(message.has('a') && !message.has('d')) this.camera.position.x -= speed;
        if(message.has('d') && !message.has('a')) this.camera.position.x += speed;
        if(message.has('w') && !message.has('s')) this.camera.position.y -= speed;
        if(message.has('s') && !message.has('w')) this.camera.position.y += speed;

        if(message.has('arrowleft') && !message.has('arrowright')) this.player1.velocity.x = -30;
        if(!message.has('arrowleft') && message.has('arrowright')) this.player1.velocity.x =  30;

        if(message.has('q')) this.camera.scale -= 0.01;
        if(message.has('e')) this.camera.scale += 0.01;

        if(this.camera.scale < 0.3) this.camera.scale = 0.3;
        if(this.camera.scale > 1) this.camera.scale = 1;
        
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
