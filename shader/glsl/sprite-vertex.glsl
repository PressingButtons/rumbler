attribute vec3 a_position;

uniform mat4 u_projection;
uniform mat4 u_transform;

uniform float u_texture_inverse;

varying vec2 v_texCoord;

void main( ) {
    gl_Position = u_projection * u_transform * vec4(a_position, 1);
    v_texCoord = a_position.xy;
}