importScripts('../system/singletons/worker_messenger.js', './signaler.js');
//==========================================================
//  Defining Global Libraries
//==========================================================
importScripts('./global/calc.js')
//==========================================================
//  Global Variable Definitions
//==========================================================
let game;
//==========================================================
//      Creating Libraries
//==========================================================
self.GameLib = { Components: { }, Objects: { }, Rumblers: { }}; //creating namespace 

//define components 
importScripts(
    './components/math.js',
    './components/camera.js',
    './components/spawner.js',
    './components/animator.js'
)

//define objects 
importScripts(
    './objects/gameobject.js',
    './objects/stageobject.js',
    './objects/rigidbody.js',
)

//define rumblers 
importScripts(
    './rumblers/rumbler.js',
    './rumblers/garf.js',
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
    GameSystem.Manager.create( message );
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