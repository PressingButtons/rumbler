class RenderInstructions {

    constructor( ) {
        this.clear( );
    }

    clear( ) {
        this.instructions = {
            buffer: 'square',
            attributes: { }, uniforms: { },  textures: { }, draw: {method: 'TRIANGLES', first_array: 0, indices: 4}
        };
    }

    setAttribute(name, length, stride, offset) {
        this.instructions.attributes[name] = {length: length, stride: stride, offset: offset}
    }

    setUniform(name, method, params) {
        this.instructions.uniforms[name] = {method: method, params: params}
    }

    setUniformMatrix(name, matrix) {
        this.setUniform(name, 'uniformMatrix4fv', [false, matrix]);
    }

    setTexture(name, texture) {
        this.instructions.textures[name] = texture;
    }

    setDraw(method, first, indices) {
        this.instructions.draw_method = method;
        this.instructions.first_array = first;
        this.instructions.indices = indices
    }

}