{
    const routes = { };

    self.Messenger = { };

    self.addEventListener('message', function( event ) {
        const message = event.data;
        const route = routes[message.route];
        if( !route ) return;
        else route( message );
    });

    Messenger.setRoute = function( route, func ) {
        routes[route] = async function( data ) {
            const content = await func( data );
            self.postMessage({ id: data.id, content: content, success: true })
        }
    }

    Messenger.sendMessage = function( route, content, transferables = [], success = true ) {
        self.postMessage({route: route, content: content, success: success}, transferables)
    }

}