/** == -----------------------------------------
 *  Importing Scripts
 == -------------------------------------------*/
 importScripts(
    '/utils/boiler/worker_messenger.js',
    './classes/signalobject.js',
    './classes/vector.js',
    './classes/gameobjects.js',
    './sys.battle.js'
);
/** == -----------------------------------------
 * Setting Routes 
 == -------------------------------------------*/
Messenger.setRoute('create', function( message ) {
    /** == -----------------------------------------
     *  Variable Declarations
     == -------------------------------------------*/
    const system = new BattleSystem( message.content );
    /** == -----------------------------------------
     *  Setup System Routes
     == -------------------------------------------*/
    system.setChannel('instance', function( options ){
        const instance = JSON.stringify(system.instance( ));
        Messenger.sendMessage('instance', instance);
    });
    /** == -----------------------------------------
     *  Return initial instance
     == -------------------------------------------*/
    system.signal('instance');

});