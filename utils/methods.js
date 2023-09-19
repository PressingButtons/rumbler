export async function loadDatabase( ) {
    return Object.assign(
        { }, 
        await getJSON('/data/core.json'),
        await getJSON('/data/objects.json')
    )
}

export function getJSON( url ) {
    return fetch( url ).then( res => res.json( ));
}

export function getText( url ) {
    return fetch( url ).then( res => res.text( ));
}

export function loadImageBitmap( url ) {
    return new Promise((resolve, reject) => {
        const image = new Image( );
        image.onload = event => resolve(createImageBitmap(image));
        image.onerror = event => reject( event );
        image.src = url;
    });
}