precision mediump float;

varying vec2 v_text_coord;

uniform sampler2D u_base;
uniform sampler2D u_palette;
uniform vec2 u_palette_dim;
uniform vec4 u_tint;

void main( ) {
  vec2 index = texture2D(u_base, v_text_coord).xy * 256.0;
  vec2 color_position = index * u_palette_dim;
  gl_FragColor = texture2D(u_palette, color_position) * u_tint;
}
