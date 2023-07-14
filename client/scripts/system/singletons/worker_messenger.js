self.messenger = (function( ) {

    const routes = { };

    self.onmessage = event => {
        if(!routes[event.data.route]) return;
        for(const route of routes[event.data.route]) {
            try {
                route(event.data.message);
                if(event.async) messenger.sendMessage(event.data.route, {status: true});
            } catch (err) {
                if(event.async) messenger.sendMessage(event.data.route, {status: false, err: err});
            }
        }
    }

    return {

        setRoute: function(route_key, route_listener, priority = -1) {
            if(!routes[route_key]) routes[route_key] = [ ];
            if(priority < 0) priority = routes[route_key].length;
            routes[route_key].splice( priority, 0, route_listener );
        },

        deleteRoute: function(route_key, route_id = null) {
            if(!routes[route_key]) return;
            if(route_id == null) return delete routes[route_key];
            routes[route_key].splice(route_id, 1);
        },

        sendMessage: function(route_key, message, transferables = []) {
            self.postMessage({route: route_key, message: message}, transferables);
        }

    }

})( );