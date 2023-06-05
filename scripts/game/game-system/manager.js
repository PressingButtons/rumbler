//==========================================================
// GameManager 
// Static Class that manages GameClasses
//==========================================================
GameSystem = (function( ) {

    let game;

    return {

        createGame: function( config ) {
            if(game) game.closeRoutes( );
            game = new GameSystem.GameInstance(config);
            let state = game.currentState( );  
            return state;
        }

    }

})( );