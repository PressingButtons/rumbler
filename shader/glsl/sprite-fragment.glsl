precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D uTexture;
uniform sampler2D uPalette;
uniform float u_palette_inverse;
uniform 

void main( ) {
    vec2 index = floor(texture2D(u_texture_0, v_texCoord).xy * 255.0);
    vec2 pixel_coord = index * u_palette_inverse;
    gl_FragColor = texture2D(u_texture_1, pixel_coord);
}