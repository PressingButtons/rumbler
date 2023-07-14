const worker = new Worker( new URL('./battle_worker.js', import.meta.url));

const messenger = {
    routes: { },

    listen: function( route, func ) {
        messenger.routes[route] = func;
    },

    send: function( route, content, transferables = []) {
        worker.postMessage({route: route, content: content}, transferables);
    },

    sendAsync: function( route, content, transferables = [ ] ) {
        return new Promise((resolve, reject) => {
            messenger.listen(route, resolve);
            messenger.send(route, content, transferables);
        });
    }
}

worker.onmessage = function( event ) {
    const message = event.data; 
    if( !messenger.routes[message.route ]) return;
    messenger.routes[message.route]( message.content );
}

//Debug Messages
messenger.listen('ping', response => {
    console.log('battle_system_ping', 'received:', Date.now( ));
})

export async function create( config, state_receiver ) {
    messenger.listen('state', state_receiver);
    return messenger.sendAsync('create', config );
}
