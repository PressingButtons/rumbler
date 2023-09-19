// The Overseeing system for the battle engine 
const Battle = new Objects.Sequencer( );
// Define Battle Detail 
Object.assign(Battle, {
    time: 0,
    players: [null, null],
    run_id: 0
})

//define the camera
Battle.Camera = {
    position: new Components.Vector( Int16Array ),
    resolution: [400, 225],
    scale: 1,
    //left
    get left( ) { return this.position.x - this.resolution[0] * this.scale },
    set left(n) { this.position.x = n + this.resolution[0] * this.scale },
    //right
    get right( ) { return this.position.x + this.resolution[0] * this.scale },
    set right(n) { this.position.x = n - this.resolution[0] * this.scale },
    //top
    get top( ) {return this.position.y - this.resolution[1] * this.scale },
    set top(n) { this.position.y = n + this.resolution[1] * this.scale },
    //bottom 
    get bottom( ) {return this.position.y + this.resolution[1] * this.scale },
    set bottom(n) { this.position.y = n - this.resolution[1] * this.scale },

    rect: function( ) {
        return [this.left, this.right, this.bottom, this.top]
    }
}
//define world
Battle.World = ((world) =>{
    // Defining General Settings 

    world.BOUND_W = 740;
    world.BOUND_H = 370;
    world.FLOOR   = 310;
    world.GRAVITY = 980;

    world.rumblers  = [null, null];
    world.stage     = [null, null, null];
    world.sfx_lower = [];
    world.sfx_upper = [];
    
    world.objects = function( ) {
        return [...this.stage, ...this.sfx_lower, ...this.rumblers, ...this.sfx_upper ];
    }

    world.pack = function( ) {
        return this.objects( ).map( x => {
            if( x != null ) return x.pack( );
        });
    }

    world.update = function( ms ) {
        for(const object of this.objects( )) {
            if( !object ) continue;
            object.signal('update', { ms: ms, world: this });
        }
    }

    // ============================
    //  Sequences 
    // ============================

    // preppping sequence ==========================
    const setStage = function( config ) {
        world.stage[0] = new GameObjects.GameObject( config.skybox || {texture: 'grid', width: 1488, height: 744 });
        world.stage[2] = new GameObjects.GameObject( config.mainground || {texture: 'sandbox', width: 800, height: 320 });
        world.stage[2].bottom = world.BOUND_H;
        if( config.background ) world.stage[1] = GameObjects.GameObject( config.background );
    }

    const setRumblers = function( config ) {
        world.rumblers[0] = createRumbler( config.player1.rumbler.character, -100 );
        world.rumblers[1] = createRumbler( config.player2.rumbler.character,  100, Math.PI );
    }

    const createRumbler = function( character, x, rotation = 0 ) {
        const rumbler = new Rumbler.Rumbler( character );
        rumbler.position.x = x;
        //rumbler.bottom = world.FLOOR;
        rumbler.rotation.y = rotation;
        return rumbler;
    }


    world.init = function( config ) {
        setStage( config );
        setRumblers( config );
    }
     //Close 
     return world;

})(new Objects.SignalObject( ));

// ==================================
//    Battle Methods
// ==================================
Battle.init = async function( message ) {
    await this.goToSequence( 'init', { on_enter: message.content });
    Messenger.sendMessage( 'instance', this.createInstance( ));
    this.run( );
}


Battle.createInstance = function( ) {
    return {
        objects: this.World.pack( ),
        camera:  this.Camera.rect( )
    }
}

Battle.onupdate = function( ms ) {
    this.World.update(ms);
    Messenger.sendMessage('instance', this.createInstance( ));
}

Battle.run = function( ) {
    const interval = 10;
    this.run_id = setInterval( this.onupdate.bind(this), interval, interval);
}

// ==================================
//    Battle Sequences
// ==================================
Battle.createSequence('init', function( sequence ) {

    sequence.enter =  async function( config ) {
        this.host.World.init( config );
        Battle.players[0] = new Components.PlayerManager( config.player1, Battle.World.rumblers[0]);
        Battle.players[1] = new Components.PlayerManager( config.player2, Battle.World.rumblers[1]);
        Battle.Camera.bottom = Battle.World.BOUND_H;
        Messenger.setRoute('input', async message => {
            for( const player of Battle.players ) 
                player.updateInput( message.content );
        })
    }

});