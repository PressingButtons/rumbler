importScripts(
    '../webworker/webworker_messenger.js',
    './worker-base.js',
    './worker-game.js',
    './worker-rumblers.js'
);

messenger.setRoute('game', message => {
    console.log('creating new game')
    game = new Game( );
    game.init(message);
    messenger.setRoute('game-input', x => game.handleInput(x));
    messenger.setRoute('game-stop',  x => game.stop( ));
    messenger.setRoute('game-play',  x => game.play( ));
    messenger.send('game');
});
