precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;
uniform vec4 u_tint;
uniform float u_palette_inverse;

void main( ) {
    vec2 index = floor(texture2D(u_texture_0, v_texCoord).xy * 255.0);
    vec2 pixel_coord = index * u_palette_inverse;
    gl_FragColor = texture2D(u_texture_1, pixel_coord) * u_tint;
}