precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_tiles;
uniform sampler2D u_map;
uniform vec4 u_tint;

void main( ) {
  vec4 texel = texture2D(u_tiles, v_texCoord);
  gl_FragColor = texel;
}
