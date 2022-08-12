export function gridToPoint(gridPos, offset = 0) {
  if(isNaN(gridPos)) return gridPos.split(":").reverse( ).map( x => parseInt(x) * System.TILESIZE + offset);
  return gridPos.reverse( ).map(x => parseInt(x) * System.TILESIZE + offset);
}

export function indexToGrid(index) {
  return Math.floor(index / System.MAP_COLUMNS) + ":" + index % System.MAP_COLUMNS;
}

export function indexToPoint(index) {
  return {
    x: Math.floor(index / System.MAP_COLUMNS) * System.TILESIZE,
    y: (index % System.MAP_COLUMNS) * System.TILESIZE
  };
}

export function pointToGrid(point) {
  return point.reverse( ).map(x => Math.floor(parseInt(x) / System.TILESIZE));
}

export function pointToTilePosition(point) {
  const grid = pointToGrid(point);
  const coord = grid.slice( ).reverse( ).map( x => x * System.TILESIZE);
  return {grid: grid, coord: coord}
}

export function tileRange(values) {
  const range = getRange(values.slice( ));
  return range.min.concat(range.max);
}

export function tileRect(grid) {
  const start = gridToPoint(grid);
  return {
    x: start[1],
    y: start[0],
    width: System.TILESIZE,
    height: System.TILESIZE
  };
}

function getRange(values, min, max) {
  const value = values.pop( );
  const topL = gridToPoint(value);
  const botR = gridToPoint(value, System.TILESIZE);
  if(min == undefined) min = topL;
  else min = min.map((x,i) => Math.min(x, topL[i]));
  if(max == undefined) max = botR;
  else max = max.map((x,i) => Math.max(x, botR[i]));
  if(values.length == 0) return {min: min, max: max};
  else return getRange(values, min, max);
}
