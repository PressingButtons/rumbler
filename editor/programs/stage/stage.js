import glMain from '../../../client/scripts/webgl/gl_main.js';

window.onload = async event => {
    const stage_uri =  window.location.href.split('#')[1];
    const stage = await fetch('/client/data/db.json').then( res => res.json( )).then( data => data.stages[stage_uri]);
    await initGraphics( stage, document.querySelector('canvas'));
}

async function initGraphics( stage, canvas) {
    canvas.width = stage.width;
    canvas.height = stage.height;
    const graphics = new glMain( );
    let test = await graphics.init( canvas );
}