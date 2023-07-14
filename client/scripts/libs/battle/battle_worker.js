//=========================================================
//  Declare Global Variables 
//=========================================================
const STAGE_HEIGHT = 600, STAGE_WIDTH = 800;
let game;
//=========================================================
//  Import Scripts
//=========================================================
importScripts('./signal_object.js', './game_lib.js', './battle_instance.js');
//=========================================================
//  Messenger
//=========================================================
const messenger = {
    routes: { },

    listen: function( route_name, route_func ) {
        this.routes[route_name] = route_func;
    },

    send: function( route, content, transferables = [ ]) {
        postMessage({route: route, content: content}, transferables);
    }

}

self.onmessage = event => {
    if( !event.data || !messenger.routes[event.data.route] ) return;
    messenger.routes[event.data.route]( event.data.content );
}
//=========================================================
//  Messaging
//=========================================================
messenger.listen( 'create', game_config => {
    Battle.create( game_config );
    messenger.send('create', true);
})