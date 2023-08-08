/** == -----------------------------------------
 *  Establish Messenger
 == -------------------------------------------*/
importScripts('../utils/boiler/worker_messenger.js');
/** == -----------------------------------------
 *  Import Battle Scripts
 == -------------------------------------------*/
 importScripts('./class/world.js');
/** == -----------------------------------------
 *  Global Variables
 == -------------------------------------------*/

/** == -----------------------------------------
 *  Set Routes
 == -------------------------------------------*/
 Messenger.setRoute('create', function( message ) {
   world = new World( message.content );
 });