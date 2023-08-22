/** == -----------------------------------------
 *  Importing Scripts
 == -------------------------------------------*/
 importScripts(
    '/utils/boiler/worker_messenger.js',
    './classes/signalobject.js',
    './classes/vector.js',
    './classes/gameobjects.js',
    './classes/rumbler.js',
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
     *  Messenger Routes
     == -------------------------------------------*/
    Messenger.setRoute('run', function( options) {
        system.run( 60 );
    });
    //input route
    Messenger.setRoute('input_event', function( options ) {
        system.handleInput( options.content );
    });
    /** == -----------------------------------------
     *  Return initial instance
     == -------------------------------------------*/
    system.signal('instance');

});