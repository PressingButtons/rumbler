precision mediump float;

varing vec2 v_texture;

uniform sampler2D u_texture0;
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform sampler2D u_texture3;

void main( ) {
  float index = floor(texture2D(u_texture0, v_texture).x * 256.0);
  //gl_FragColor = texture2D(u_texture1, vec2(index, u_))
}
