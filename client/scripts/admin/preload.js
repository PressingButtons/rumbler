export default async function preload(admin) {
    admin.db = await fetch('/data/db.json').then( res => res.json( ));
    await compileShaders( admin.graphics );
    await loadBitmaps( admin.graphics, admin.db.textures );
    console.log( 'system -- preload complete ')
}

async function compileShaders(graphics) {
    const config = await fetch('../../shader/config.json').then( res => res.json( ));
    for( const key in config ) await compileShader( graphics, key, config[key] );
}

async function compileShader( graphics, key, config ) {
    const vertex = await fetch('../../' + config.vertex ).then( res => res.text( ));
    const fragment = await fetch( '../../' + config.fragment ).then( res => res.text( ));
    graphics.compile( key, vertex, fragment );
}

async function loadBitmaps(graphics, textures ) {
    for(const key in textures) await loadBitmap( graphics, key, textures[key]);
}

async function loadBitmap( graphics, key, url) {
    return new Promise((resolve, reject) => {

        const image = new Image( );

        image.onload = event => {
            resolve( graphics.setTexture( key, image ));
        }

        image.onerror = event => {
            reject( 'Failed to load',  key);
        }

        image.src = `../../images/${url}`;

    });
}

