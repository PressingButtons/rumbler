const run_list = { };

const update = function( ) {
    for( const id in run_list ) run_list[id]( );
    requestAnimationFrame( update );
}

requestAnimationFrame( update );

export function run( id, func ) {
    run_list[id] = func;
}

export function stop( id ) {
    delete run_list[id];
}


