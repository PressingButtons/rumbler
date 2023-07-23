//==========================================================
// GameManager 
// Static Class that manages GameClasses
//==========================================================
GameSystem.INTERVAL = 16.67;
GameSystem.HEART_BEAT = 10;

GameSystem.Manager = new Signaler( );

Object.assign(GameSystem.Manager, {
    run_id: null, last: null, cached_states: { }, state_stack: []
});


Object.assign( GameSystem.Manager, {

    create: function( config ) {
        this.clear( );
        this.game = new GameSystem.GameInstance( config );
        this.run( );
    }, 

    clear: function( ) {
        if(!this.game) return;
        this.game.closeRoutes( );
        this.cached_states  = { };
        this.state_stack    = [ ];
    },

    run: function( ) {
        this.last = performance.now( );
        this.run_id = setInterval( this.update.bind(this), GameSystem.HEART_BEAT);
    },

    stop: function( ) {
        clearInterval(this.run_id);
    },

    update: function(timestamp) {
        while(this.state_stack.length < 10) this.state_stack.push( this.game.update(GameSystem.INTERVAL));
        if( timestamp - this.last < GameSystem.INTERVAL) return;  
        this.signal('publish');
        this.last = timestamp;
    }

});

GameSystem.Manager.setRoute('publish', function( ) {
    const state = GameSystem.Manager.state_stack.shift( );
    messenger.sendMessage('state', state);
});