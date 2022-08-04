import GameMapLayer from './layer.js';

let gl;

const config = {
  tiles: null,
  layers: [0, 0, 0].map((x, i) => new GameMapLayer(i)),
  skybox: new Arachnid.Texture( ),
  backgroundColor: null,
  collisionTiles: null,
  name: null
}

export async function init(glContext) {
  gl = glContext;
  config.collisionTiles = GameSystem.bufferData.collisionTiles;
  config.backgroundColor = GameSystem.bufferData.backgroundColor;
  config.tiles = await Arachnid.Loaders.loadImage('./images/tiles.webp');
}

export async function load(name) {
  resetConfiguration( );
  const mapConfig = await Arachnid.Getters.getJSON(`./data/stages/${name}.json`);
  config.name = mapConfig.name;
  if(mapConfig.backgroundColor) config.backgroundColor.set(mapConfig.backgroundColor);
  if(mapConfig.skybox) await config.skybox.load(gl, mapConfig.skybox);
  await setLayers(mapConfig);
}

export function getMap( ) {
  return config;
}

//Internal Functions
const resetConfiguration = function( ) {
  for(const layer of config.layers) layer.reset( );
  config.skybox.unload( );
  config.backgroundColor.set([0, 0, 0, 1]);
  config.collisionTiles.fill(0);
  config.name = null;
}

const setLayers = async function(mapConfig) {
  let depth = 0;
  for(let i = 0; i < mapConfig.layers.length; i++) {
    await config.layers[i].load(gl, mapConfig.layers[i], config.tiles, 1 - depth);
  }
}
