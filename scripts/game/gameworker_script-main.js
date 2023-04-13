importScripts(
    '../webworker/webworker_messenger.js',
    './gameworker_script-tilemaps.js',
    './gameworker_script-system.js'
);

messenger.setRoute('create', function(message) {
    /*
    const game = new Game(message);
    messenger.setRoute('game-input', message => game.readInput(message));
    messenger.setRoute('game-start', message => game.start(message));
    messenger.setRoute('game-stop', message => game.stop(message));
    */
});

