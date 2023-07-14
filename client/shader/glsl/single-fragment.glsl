precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_texture_0;
uniform vec4 u_tint;

void main( ) {
  gl_FragColor = texture2D(u_texture_0, v_texCoord);
}