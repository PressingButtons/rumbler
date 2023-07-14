attribute vec3 a_position;
attribute vec2 a_texture_coord;

uniform mat4 u_projection;
uniform mat4 u_transform;

varying vec2 v_texCoord;

void main( ) {
    gl_Position = u_projection * u_transform * vec4(a_position, 1);
    v_texCoord = a_texture_coord;
}