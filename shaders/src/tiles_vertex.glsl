attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_projection_matrix;
uniform mat4 u_transform_matrix;

varying vec2 v_texCoord;

void main( ) {
  gl_Position = u_projection_matrix * u_transform_matrix * vec4(a_position, 0, 1);
  v_texCoord = a_texCoord;
}
