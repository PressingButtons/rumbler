precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_texture_0; //source
uniform sampler2D u_texture_1; //palette
uniform sampler2D u_texture_2; //map
uniform vec4 u_tint;

uniform vec2 uPalette_size;


vec4 mapPixelIndex( vec2 index ) {
    vec4 map_index = texture2D( u_texture_2, index ).x;
    return texture2D( u_texture_1, vec2(map_index, index.y) / uPalette_size );
}

void main( ) {
    vec2 source = texture2D(u_texture_0, v_texCoord);
    vec4 pixel = mapPixelIndex( source );
    gl_FragColor = pixel * u_tint;
}