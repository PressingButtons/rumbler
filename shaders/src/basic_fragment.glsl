precision mediump float;

varying vec2 v_text_coord;

uniform sampler2D u_texture0;

void main( ) {
  gl_FragColor = texture2D(u_texture0, v_text_coord);
}
