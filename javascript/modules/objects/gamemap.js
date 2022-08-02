const transformBuffer = new Float32Array(48);
const transforms = [
  new Float32Array(transformBuffer, 0, 16),
  new Float32Array(transformBuffer, 16, 16),
  new Float32Array(transformBuffer, 32, 16)
];

let tiles = new Arachnid.Texture( );
let layers = [null, null, null];
let m4;
let bgColor = '#000';
let skybox = {status: 0, texture: new Arachnid.Texture( )};

export function init(gl) {
  m4 = glMatrix.mat4 || mat4;
  if(!m4) {
    console.trace( );
    throw `Error, glMatrix(mat4) Library not found. Cannot perform matrix operations.`;
  }
  return tiles.load(gl, './images/tiles.webp');
}

export async function load(gl, name) {
  layers.fill(null)
  transforms.forEach(t => m4.identity(t));
  const data = await Arachnid.Getters.getJSON(`./data/stages/${name}.json`);
  await setLayers(gl, data.layers);
  bgColor = data.backgroundColor || "#000";
  if(data.background) await skybox.load(data.background);
}

export function adjustLayer(index, position) {
  if(!layers[index]) throw `Error: Layer[${index}] does not exist!`;
  layers[index].x = position.x;
  layers[index].y = position.y;
}

export function getMap( ) {
  //transforms
  setTransforms( );
  let pkg = { tiles: tiles, layers: [], backgroundColor: bgColor, skybox: skybox }
  for(let i = 0; i < layers.length; i++) {
    if(!layers[i]) break;
    pkg.layers.push(Object.assign({}, layers[i], {transform: transforms[i]}));
  }
  return pkg;
}

//INTERNAL FUNCTIONS
async function setLayers(gl, layerURLs) {
  let depth = 0;
  for(let i = 0; i < layers.length; i++) {
    if(!layerURLs[i]) break;
    const map = new Arachnid.Texture( );
    map.load(gl, layerURLs[i]);
    layers[i] = {map: map, x: 0, y: 0, tint: [0, 0, 0, depth]};
    depth += 0.15;
  }
}

function setTransforms( ) {
  for(let i = 0; i < layers.length; i++) {
    if(!layers[i]) break;
    m4.fromTranslation(transforms[i], [layers[i].x, layers[i].y, 0]);
  }
}
