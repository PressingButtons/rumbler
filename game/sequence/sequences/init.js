import * as glMain from '../../../webgl/gl_main.js'

import Sequence from "../sequence.js";

window.DEBUG = true;

const sequence = new Sequence( 'init' );

sequence.enter = async function( system ) {
   system.graphics = await initGraphics( );
   system.database = await fetch('/db.json').then(res => res.json( ));
   if( DEBUG ) console.log('database opened');
   this.signal('test');
}

const initGraphics = async( ) => {
    await  glMain.manager.init(document.getElementById('game'));
    return glMain.manager;
}

export { sequence };