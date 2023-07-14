precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;
uniform vec4 u_tint;

void main( ) {
    vec2 index = texture2D(u_texture_0, v_texCoord).xy;
    vec4 pixel = texture2D(u_texture_1, index);
    gl_FragColor = pixel * u_tint;
}