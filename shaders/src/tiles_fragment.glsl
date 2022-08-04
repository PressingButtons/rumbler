precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D uTileLayer;
uniform vec4 u_tint;

void main( ) {
  gl_FragColor = texture2D(uTileLayer, v_texCoord) * u_tint;
}

/*
uniform vec2 u_map_size;
uniform vec2 u_tilemap_size;
uniform vec2 u_tilesize;
uniform vec4 u_tint;

uniform sampler2D u_map;
uniform sampler2D u_tilemap;
vec2 index = texture2D(u_map, v_texCoord).xy * 256.0;
vec2 offset = mod(v_texCoord, (1.0 / u_tilesize));
vec2 texelCoord = index + offset;
gl_FragColor = texture2D(u_tilemap, texelCoord);
*/
