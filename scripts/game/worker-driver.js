importScripts(
    '../webworker/webworker_messenger.js',
    './game-main.js'
);

messenger.setRoute('game', message => {
    game = new Game(message);
    messenger.setRoute('game-input', game.handleInput);
    messenger.setRoute('game-stop', game.stop);
    messenger.setRoute('game-play', game.play);
    message.send('game');
});