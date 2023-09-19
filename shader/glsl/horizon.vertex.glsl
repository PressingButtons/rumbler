attribute vec3 a_position;
attribute vec4 a_vertex_color;

varying lowp vec4 vColor;

void main( ) {
    gl_Position = vec4(a_position, 1);
    vColor = a_vertex_color;
}