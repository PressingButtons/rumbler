let config;
let data;
let lib;

export async function init( ) {
  let source = await System.assetLoader.loadMapData( );
  const numStages = Math.floor(source["data.webp"].canvas.width / System.MAP_COLUMNS);
  config = parseConfig(source["config.json"], numStages);
  data = source["data.webp"];
  lib = App.Tiles;
  document.addEventListener('stampmap', onStamp);
}

export function getStage(i) {
  return cropStage(i);
}


export function setSkyBox(name, url) {
  if(config.data[name].skybox == null) {
    config.subfiles.length;
    config.subfiles.push(url);
  } else {
    config.subfiles[config.data[name].skybox] = url;
  }
}

export function setBGColor(name, color) {

}

// Listeners
const onStamp = event => {
  const id = event.detail.id;
  for(const index in event.detail.data) setPixel(id[0], id[1], index, event.detail.data[index]);
  document.dispatchEvent(new CustomEvent('mapupdate', {detail: cropStage(data, id[0])}))
}

// Methods =========================
const convertToColor = value => {
  return '#' + value[0].toString(16).padStart(2, 0) + value[1].toString(16).padStart(2, 0) + "00FF";
}

const cropStage = (source, index) => {
  let x = index * System.MAP_COLUMNS;
  let layers = [];
  for(let i = 0; i < 4; i++)
    layers.push(source.getImageData(x, i * System.MAP_ROWS, System.MAP_COLUMNS, System.MAP_ROWS).data);
  return layers;
}


const insertTemplate = (source, i) => {
  const name = 'Untitled' + ("" + i).padStart(2, 0);
  source[name] = {
    name: name,
    index: i,
    skybox: null,
    bgColor: [0.0, 0.0, 0.0, 1.0],
    spawns: [[40, 23]],
  }
}

const parseConfig = (source, numStages) => {
  const keys = Object.keys(source.data);
  for(let i = 0; i < numStages; i++) {
    if(keys[i]) continue;
    insertTemplate(source.data, i);
  }
  return source;
}

const setPixel = (mapid, layerid, grid, value) => {
  const coord = grid.split(':').map(x => parseInt(x));
  let x = mapid * System.MAP_COLUMNS + coord[1];
  let y = layerid * System.MAP_ROWS  + coord[0];
  let color = convertToColor(value);
  data.fillStyle = color;
  data.fillRect(x, y, 1, 1);
}
