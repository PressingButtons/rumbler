export default async function preload(gl) {
  const tiles = new Arachnid.Texture( );
  tiles.load(gl, './images/tiles.webp')
  return {
    tiles: tiles
  }
}
