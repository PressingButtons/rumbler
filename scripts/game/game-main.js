importScripts('../system/singletons/worker_messenger.js', './signaler.js');
//==========================================================
//  Global Variable Definitions
//==========================================================
let game;
//==========================================================
//      Creating Libraries
//==========================================================
self.GameLib = { Components: { }, Objects: { }}; //creating namespace 

//define components 
importScripts(
    './components/math.js',
    './components/camera.js',
    './components/spawner.js'
)

//define objects 
importScripts(
    './objects/gameobject.js',
    './objects/stageobject.js',
)

//==========================================================
//      Game System
//==========================================================
self.GameSystem = { }; //gamesystem namespace 

importScripts(
    './game-system/manager.js',
    './game-system/gameinstance.js'
);
//==========================================================
//      Creating Routes
//==========================================================
//route to create new game environment
messenger.setRoute('create-game', message => {
    const data = GameSystem.createGame( message );
    messenger.sendMessage('create-game', {status: true, content: data});
});
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================