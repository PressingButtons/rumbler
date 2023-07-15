attribute vec3 a_position;

uniform mat4 u_projection;
uniform mat4 u_transform;
uniform mat4 u_texMatrix;

varying vec2 v_texCoord;

void main( ) {
    vec4 position = vec4(a_position, 1);
    gl_Position   = u_projection * u_transform * position;
    v_texCoord    = (u_texMatrix  * position).xy;
}

