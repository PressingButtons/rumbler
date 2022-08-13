precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_tiles;
uniform sampler2D u_map;
uniform vec4 u_tint;

void main( ) {
  vec2 index = texture2D(u_map, v_texCoord).xy * 256.0;
  vec2 mapCoord = mod(fract(index), (16.0/512.0));
  vec2 texCoord = floor(index / 512.0) * 16.0;
  vec4 texel = texture2D(u_tiles, texCoord + mapCoord);
  gl_FragColor = texel;
}
