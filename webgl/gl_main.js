import WrappedWorker from "../utils/classes/wrapped_worker.js";

const manager = new WrappedWorker( new URL('./gl_worker.js', import.meta.url) );

manager.init = async function( canvas, url ) {
    canvas = canvas.transferControlToOffscreen( );
    await this.sendMessage('init', canvas, [canvas]);
    await configureShaders(url);
    console.log('Graphics Initialized');
}

const configureShaders = async ( url ) => {
    url = url ? new URL( url, import.meta.url ) : new URL( '../', import.meta.url );
    //
    const config = await fetch(new URL('/shader/config.json', url )).then( res => res.json( ));
    for( const key in config ) {
        const vertex   = await fetch(new URL(config[key].vertex, url)).then( res => res.text( ));
        const fragment = await fetch(new URL(config[key].fragment, url)).then( res => res.text( ));
        await manager.sendMessage('compile', { name: key, vertex: vertex, fragment: fragment });
    }
}

manager.fill = function( color ) {
    this.sendMessage('fill', color );
}

manager.createTexture = function( name, bitmap ) {
    return this.sendMessage('texture', {name: name, bitmap: bitmap}, [bitmap])
}

manager.render = function( config ) {
    return this.sendMessage('render', config );
}

export { manager }