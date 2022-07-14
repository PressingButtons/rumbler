attribute vec2 a_position;
attribute vec2 a_text_coord;

uniform mat4 u_projection_matrix;
uniform mat4 u_transform_matrix;
uniform mat4 u_texture_matrix;

varying vec2 v_texture;

void main( ) {
  gl_Position = u_projection_matrix * u_transform_matrix * vec4(a_position, 0, 1);
  v_texture = (u_texture_matrix * vec4(a_texture, 0, 1)).xy;
}
