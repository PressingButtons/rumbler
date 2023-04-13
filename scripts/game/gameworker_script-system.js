const GameSystem = (( ) => {

    let game = null;


    //routes 
    messenger.setRoute('game', message => {
        message.tilemap = Tilemaps.getMap(message.tilemap);
        game = new Game(message);
    });

})( );