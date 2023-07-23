const worker = new Worker(new URL('./graphics_worker.js', import.meta.url));

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


//export function
export async function init( canvas ) {
    const offscreen = canvas.transferControlToOffscreen( );
    return messenger.sendAsync('init', offscreen, [offscreen]);
}

export function compile( name, vertex, fragment ) {
    return messenger.sendAsync('compile', {name: name, vertex: vertex, fragment: fragment}); 
}

export function fill( color ) {
    messenger.send( 'fill', color );
}

export async function setTexture( name, image ) {
    const bitmap = await createImageBitmap(image);
    messenger.sendAsync('texture', {name: name, bitmap: bitmap}, [bitmap]);
}

export function render( detail ) {
    messenger.send('render', detail );
}

export function debug( ) {
    messenger.send('DEBUG');
}