// ================================
// Messenger Boiler Script
// ================================
importScripts('/utils/boiler/worker_messenger.js');
// ================================
// Load in Core Libraries
// ================================
importScripts(
    './lib/objects.js',
    './lib/components.js',
    './lib/gameobjects.js',
    './lib/system.js'
);
// ================================
// Load in Rumbler Libraries
// ================================
importScripts('./lib/rumbler.js');
// ================================
// Variables
// ================================
let game;
// ================================
// Routes
// ================================
Messenger.setRoute('create', async function( message ) {
    if( game ) await game.close( );
    game = new System( );
    const instance = game.init( JSON.parse( message.content ))
    Messenger.sendMessage('instance', JSON.stringify( instance ));
    game.run( );
});