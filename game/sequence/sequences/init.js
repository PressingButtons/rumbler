import { loadDatabase } from '../../../utils/code.js';
import * as glMain from '../../../webgl/gl_main.js'
import * as updater from '../../system/components/runner.js';
import * as input   from '../../input/input.js'

import Sequence from "../sequence.js";

window.DEBUG = true;

const sequence = new Sequence( 'init' );

sequence.enter = async function( system ) {
   system.database = await loadDatabase( );
   system.graphics = await initGraphics( system.database.textures );
   system.updater  = updater;
   setupControllers( system );
   if( DEBUG ) console.log('database opened');
   this.signal('test');
}

const initGraphics = async( textures ) => {
    await glMain.manager.init(document.getElementById('game'));
    for( const name in textures ) {
        const bitmap = await loadBitmap(new URL('/images/' + textures[name], import.meta.url));
        await glMain.manager.createTexture( name, bitmap );
    }

    return glMain.manager;
}

const loadBitmap = ( url ) => {
    return new Promise( (resolve, reject ) => {
        const image = new Image( );
        image.onload = event => resolve(createImageBitmap(image));
        image.onerror = event => reject( event );
        image.src = url;
    });
}

const setupControllers = ( system ) => {
    system.input = input;
    input.init( system.updater );
}

export { sequence };