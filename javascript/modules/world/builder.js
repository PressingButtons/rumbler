import World from './world.js';

export function build(request) {
  return fetch(`./data/stages/${request}.json`)
  .then(response => response.json( ))
  .then(gatherResources);
}

async function gatherResources(desc) {
  const background = await Arachnid.Loaders.loadImage(desc.background);
  return createWorld({
    name: desc.name,
    background: background,
    backgroundColor: desc.backgroundColor
  });
}

function createWorld(config) {
  return new World(config);
}
