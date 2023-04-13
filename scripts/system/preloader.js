export default async function preload(utils) {
    return {
        bitmaps: await loadTextures(utils)
    }
}

async function loadTextures(utils) {
    const config = await utils.fetchJSON('./data/textures.json');
    const textures = await createBitmaps(config.textures, utils);
    const maps = await createBitmaps(config.maps, utils);
    return {texturs: textures, maps: maps}
}

async function createBitmaps(config, utils) {
    const result = { };
    for(const key in config) {
        result[key] = await utils.loadImage('./images/' + config[key]);
    } 
    return result;
}
