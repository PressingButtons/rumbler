export function mousePoint(event) {
  const rect = event.target.getBoundingClientRect( );
  const x = event.clientX - rect.x;
  const y = event.clientY - rect.y;
  return [x, y];
}
