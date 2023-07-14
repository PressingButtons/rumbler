export default async function preload( ) {
    const bitmaps = await loadBitmaps( );
    return {bitmaps: bitmaps}
}

function loadImageBitmap( url ) {
    return new Promise((resolve, reject) => {
        const image = new Image( );
        image.onload = async event => resolve( await packageBitmap(url, image));
        image.onerror = event => reject(event);
        image.src = url;
    });
}

function loadBitmaps( ) {
    return Promise.all([
        loadImageBitmap('../images/stage_pattern.webp'),
        loadImageBitmap('../images/stage_summit.webp'),
        loadImageBitmap('../images/garf.png'),
    ])
}

async function packageBitmap( url, image ) {
    return { bitmap: await createImageBitmap(image), name: url.substring(url.lastIndexOf('/') + 1).split('.')[0]}
}