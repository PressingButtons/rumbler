//========================================================
// Declare Variables 
//========================================================
const shaders  = { };
const buffers  = { };
const textures = { };
const m0 = new Float32Array(16);
const m1 = new Float32Array(16);
const m2 = new Float32Array(16);
const m00 = new Float32Array(16);
let DEBUG = false;
//========================================================
// Importing Scripts
//========================================================
importScripts('./glmatrix-min.js', './compile.js', './graphics_methods.js');
const mat4 = glMatrix.mat4;
//========================================================
// Receiving Messages
//========================================================
self.onmessage = async event => {
    const message = event.data;
    if( !message.route ) return;
    switch( message.route ) {
        case 'init': 
            self.gl = message.content.getContext('webgl', {premultipliedAlpha: false});
            buffers.square   = createBuffer(new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]));
            buffers.position = createBuffer(new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]));
            buffers.texture  = createBuffer(new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]));
            textures.palette_group = gl.createTexture( );
            sendMessage('init', true);
        break;
        case 'compile': 
            shaders[message.content.name] = await compile(gl, message.content.vertex, message.content.fragment);
        break;
        case 'fill': 
            fill( message.content );
        break;
        case 'texture': 
            const texture = createTexture( message.content.bitmap );
            textures[ message.content.name ] = texture;
            sendMessage('texture', true);
        break;
        case 'render': 
            fill([0, 0, 0.2, 1]);
            if( !message.content.camera ) return;
            setProjection( m0, message.content.camera );
            let shader = null;
            for( const object of message.content.objects ) shader = render( object, shader );
        break;
        case 'DEBUG': 
            DEBUG = DEBUG ? false: true;
        break;
    }
}

self.sendMessage = ( route, content, transferables = []) => {
    self.postMessage({route: route, content: content}, transferables);
}
