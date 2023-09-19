import WrappedWorker from "../utils/classes/wrapped_worker.js";

const GraphicsGL = new WrappedWorker( new URL('./gl_worker.js', import.meta.url) );

GraphicsGL.init = async function( canvas, url ) {
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
        await GraphicsGL.sendMessage('compile', { name: key, vertex: vertex, fragment: fragment });
    }
}

GraphicsGL.fill = function( color ) {
    this.sendMessage('fill', color );
}

GraphicsGL.createHorizon = async function( horizon_line = 0.75 ) {
    const position = new Float32Array(
        [
            -1, -1, 1, -1, -1, horizon_line, 1, horizon_line,
            -1, horizon_line, 1, horizon_line, -1, 1, 1, 1
        ]
        );
    const color = new Float32Array([ ])
    await this.sendMessage('buffer', {name: 'horizon_position', data: position}, position );
    await this.sendMessage('buffer', {name: 'horizon_color', data: color}, color );
}

GraphicsGL.createTexture = function( name, bitmap ) {
    return this.sendMessage('texture', {name: name, bitmap: bitmap}, [bitmap])
}

GraphicsGL.render = function( config ) {
    return this.sendMessage('render', config );
}

export default GraphicsGL;