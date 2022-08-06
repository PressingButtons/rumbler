export function mousePosition(event) {
  const boundRect = event.target.getBoundingClientRect( );
  const x = event.clientX - boundRect.x;
  const y = event.clientY - boundRect.y
  const row = Math.floor(y / System.TILESIZE);
  const col = Math.floor(x / System.TILESIZE);
  return {x: x, y: y, row: row, col: col}
}

export function tileCrop(cells) {
  let min = [null, null], max = [null, null];
  for(const value in cells) {
    let rect = tileRect(value);
    if(!min[0] || min[0] > rect.x) min[0] = rect.x;
    if(!min[1] || min[1] > rect.y) min[1] = rect.y;
    //===========================================//
    if(!max[0] || max[0] < rect.x + rect.width) max[0] = rect.x + rect.width;
    if(!max[1] || max[1] < rect.y + rect.height) max[1] = rect.y + rect.height;
  }
  return {x: min[0], y: min[1], width: max[0] - min[0], height: max[1] - min[1]};
}

export function tileRect(index) {
  const start = index.split(':').map(x => parseInt(x) * System.TILESIZE);
  const end = start.map(x => x + System.TILESIZE);
  return {x: start[1], y: start[0], width: end[1] - start[1], height: end[0] - start[0]};
}
