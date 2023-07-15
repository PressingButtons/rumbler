precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_texture_0; 
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform vec4 u_tint;

uniform vec2 u_palette_size;
uniform vec2 u_map_size;

vec4 getTexelByIndex( vec4 index ) {
    vec2 coord = index.yx / ( 256.0, 256.0);
    return texture2D( u_texture_1, coord) * index[3];
}

vec4 mapCoordinate( vec4 coord ) {
    float index = texture2D( u_texture_2, vec2(coord.x, 0)).x;
    return vec4( 0.0, 0.0, 0.0, 0.0 );
}

vec4 getIndexByPixel( ) {
    vec4 pixel = texture2D( u_texture_0, v_texCoord );
    vec2 index = floor(pixel.xy * 256.0);
    return vec4( index, 0, pixel[3]);
}

void main( ) {
    vec4 index = getIndexByPixel( );
    gl_FragColor = getTexelByIndex( index );
}

