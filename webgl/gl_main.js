import WrappedWorker from "../utils/classes/wrapped_worker.js";

const manager = new WrappedWorker( new URL('./gl_worker.js', import.meta.url) );

manager.init = async function( canvas ) {
    canvas = canvas.transferControlToOffscreen( );
    await this.sendMessage('init', canvas, [canvas]);
    const config = await fetch('/shader/config.json').then( res => res.json( ));
    for( const key in config ) {
        const vertex   = await fetch(config[key].vertex).then( res => res.text( ));
        const fragment = await fetch(config[key].fragment).then( res => res.text( ));
        await this.sendMessage('compile', { name: key, vertex: vertex, fragment: fragment });
    }
    console.log('Graphics Initialized');
}

manager.fill = function( color ) {
    this.sendMessage('fill', color );
}

manager.render = function( config ) {
    this.sendMessage('render', config );
}

export { manager }