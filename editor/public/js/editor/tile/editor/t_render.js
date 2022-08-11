export default function renderMap(tiles, canvases, layerdata, tilesize = 16) {
  for(let i = 0; i < 4; i++)
    renderLayer(tiles, canvases[i], layerdata[i], tilesize);
}

const renderLayer = (tiles, ctx, layer, tilesize) => {
  for(let i = 0; i < layer.length; i += 4) {
    const value = Array.from(layer.subarray(i, i + 2)).map(x => x * tilesize).reverse( );
    const coord = indexCoord(i, tilesize);
    ctx.clearRect(coord[0], coord[1], tilesize, tilesize);
    if(value[0] + value[1] == 0) continue;
    ctx.drawImage(tiles, ...value, tilesize, tilesize, ...coord, tilesize, tilesize);
  }
}

const indexCoord = (index, ts) => {
  let i = Math.floor(index/4);
  let x = (i % System.MAP_COLUMNS) * ts;
  let y = Math.floor(i / System.MAP_COLUMNS) * ts;
  return [x, y];
}
