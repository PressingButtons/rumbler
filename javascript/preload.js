async function preload( ) {
  const tiles = new Arachnid.Texture( );
  tiles.load('./images/tiles.webp')

  return {
    tiles: tiles
  }
}
