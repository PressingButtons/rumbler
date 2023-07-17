precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_texture_0; 
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform vec4 u_tint;

uniform vec2 u_palette_size;
uniform vec2 u_map_size;

vec4 getPaletteColor( vec4 source, float group ) {
    float x = source.y / u_palette_size.x;
    float y = group / u_palette_size.y;
    return texture2D( u_texture_1, vec2(x, y)) * source[3];
}

vec4 getSourceDetail( ) {
    vec4 texel = texture2D( u_texture_0, v_texCoord );
    return vec4(floor( texel.xy * 16.0 ), 0.0, texel[3]);
}

float mapColorGroup( vec4 source ) {
    float index = source.x / u_map_size.x;
    vec4  texel = texture2D( u_texture_2, vec2( index, 0.0));
    return texel.x * 256.0;
}

vec4 translatePixel( ) {
    vec4 source = getSourceDetail( );
    float group = mapColorGroup( source );
    return getPaletteColor( source, group );
}

void main( ) {
    vec4 texel = translatePixel( );
    gl_FragColor = texel;
}

