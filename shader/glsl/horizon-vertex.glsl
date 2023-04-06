attribute vec3 a_position;

uniform mat4 u_projection;
uniform mat4 u_transform;

varying vec2 v_coord;

void main( ) {
    gl_Position = u_projection * u_transform * vec4(a_position, 1);
    v_coord = a_position.xy;
}