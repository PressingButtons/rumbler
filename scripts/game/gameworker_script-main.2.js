importScripts(
    '../webworker/webworker_messenger.js',
    './gameworker_script-tilemaps.js',
    './gameworker_class-game.js'
);

{
    let game = null

    messenger.setRoute('game', message => {
        message.tilemap = Tilemaps.getMap(message.tilemap);
        game = new Game(message);
        messenger.setRoute('input', game.handleInput);
    });

}