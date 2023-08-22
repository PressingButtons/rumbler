const methods = [];

export function run( method ) {
    const index = methods.indexOf( method );
    if( index != -1) return index;
    return methods.push( method ) - 1;
}

export function stop( id ) {
    methods.splice( id, 1 );
}

function loop(timestamp) {
    for(const method of methods) method( );
    window.requestAnimationFrame( loop );
}

window.requestAnimationFrame( loop );