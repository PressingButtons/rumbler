self.messenger = (function( ) {

    const routes = { };

    function createRoute(route_key, method) {
        routes[route_key] = function(message) {
            if(message.data.type == route_key) method(message.data);
        }
        return routes[route_key];
    }

    return {

        send: function(message_type, message_content, transferables = [ ]) {
            self.postMessage(
                {type: message_type, content: message_content}, transferables
            );
        },

        setRoute: function(route_key, method) {
            const route = createRoute(route_key, method);
            self.addEventListener('message', route);
        },

        deleteRoute: function(route_key) {
            self.removeEventListener('message', routes[route_key]);
        }
    }

});
