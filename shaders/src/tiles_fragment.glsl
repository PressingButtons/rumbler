precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_tiles;
uniform sampler2D u_map;
uniform vec2 u_stagesize;
uniform vec2 u_tilemap_size;
uniform float u_tilesize;
uniform vec4 u_tint;

void main( ) {
  vec2 mapCoord = v_texCoord * u_stagesize;
  vec2 offset = mod(mapCoord, u_tilesize);
  vec2 texVal = texture2D(u_map, v_texCoord).yx * 256.0;
  vec2 start  = floor(texVal) * u_tilesize;
  vec2 pixelCoord = (start + offset) / u_tilemap_size;
  gl_FragColor = texture2D(u_tiles, pixelCoord) * u_tint;
}
