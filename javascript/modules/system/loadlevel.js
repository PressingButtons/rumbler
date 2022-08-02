export function loadLevel(name) {
  return Arachnid.Getters.getJSON(`./data/stages/${name}.json`)
  .then(parseLevel);
}

async function parseLevel(stageobject) {
  const layers = await createLayers(stageobject.layers);
}

async function createLayers(layerArray) {
  let layers = [ ];
  for(const layerURL of layerArray) {
    const texture = new Arachnid.Texture( );
    await texture.load(layerURL);
    layers.push(texture);
  }
  return layers;
}
