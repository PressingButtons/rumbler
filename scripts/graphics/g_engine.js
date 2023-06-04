importScripts('./glmatrix-min.js', './quickGL/quickGL.js');
{
    class GraphicsEngine {

        #quickGL;
        #buffer;
        #textures = { };
        #matrix_textre = new Float32Array(16);
        #matrix_transform = new Float32Array(16);
        #matrix_projection = new Float32Array(16);

        constructor(canvas) {
            this.#quickGL = new QuickGL(canvas, {premultipledAlpha: false});
            this.currentShader;
            this.#init( );
        }
        
        /**
         * @returns {WebGL2RenderingContext}
         */
        get gl( ) {
            return this.#quickGL.gl;
        }

        #init( ) {
            this.#buffer = this.#quickGL.createBuffer(new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]));
        }

        #selectProgram(name) {
            if(this.currentShader == name) return;
            this.currentShader = name;
            this.#quickGL.useProgram(this.currentShader);
        }

        #setTextures( textures ) {
            textures.forEach((name, i) => {
                this.#quickGL.setTexture('u_texture_' + i, this.#textures[name], i);
            });
        }

        #setProjectionMatrix( camera ) {
            return glMatrix.mat4.ortho( this.#matrix_projection, camera.left, camera.right, camera.bottom, camera.top, 1, -1);
        }

        #setTransformMatrix( detail ) {
            console.log(detail.width, detail.height)
            let matrix = glMatrix.mat4.fromTranslation(this.#matrix_transform, detail.position);
            glMatrix.mat4.rotateX( matrix, matrix, detail.rotation[0] );
            glMatrix.mat4.rotateY( matrix, matrix, detail.rotation[1] );
            glMatrix.mat4.rotateZ( matrix, matrix, detail.rotation[2] );
            glMatrix.mat4.translate( matrix, matrix, [-detail.width * 0.5, -detail.height * 0.5, 0]);
            glMatrix.mat4.scale( matrix, matrix, [detail.width, detail.height, 1]);
            return matrix;
        }

        init(shader_definitions) {
            return new Promise((resolve, reject) => {
                try {
                    for(const key in shader_definitions) 
                    this.#quickGL.compile(key, shader_definitions[key].vertex, shader_definitions[key].fragment);
                    resolve( );
                } catch (err) {
                    reject(err);
                }
            });
        }

        cacheTexture( texture ) {
            this.#textures[texture.name] = this.#quickGL.createTexture(texture.bitmap);
            return true;
        }

        draw(detail) {
            this.#setProjectionMatrix(detail.camera);
            for(const entry of detail.entries) {
                this.#selectProgram(entry.shader_type);
                switch(entry.shader_type) {
                    case 'single_texture': this.renderTexture( entry );
                }
            }
        }

        renderTexture( detail ) {
            this.#quickGL.setBuffer( this.#buffer );
            this.#quickGL.setAttribute('a_position', 2, 0, 0);
            this.#quickGL.setUniform('uniform4fv', 'u_tint', detail.tint);
            this.#quickGL.setMatrix('u_transform',  this.#setTransformMatrix(detail));
            this.#quickGL.setMatrix('u_projection', this.#matrix_projection);
            this.#setTextures( detail.textures );
            this.#quickGL.draw(0, 4);
            console.log('drawn');
        }


        fill(color) {
            this.#quickGL.fill(convertHex2RGBA(color));
        }
    } //class end ========================================================================================

    // protected 

    const convertHex2RGBA = color => {
        if(color instanceof Array) return color;
        if(color.split('#').length == 1) return null;
        let hex = color.split('#')[1];
        if(hex.length == 3) hex = bumpHex(hex);
        else if(hex.length == 6) hex += "FF";
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const a = parseInt(hex.slice(6, 8), 16);
        return [r / 255, g / 255 , b / 255, a / 255];
    }

    const bumpHex = hex => {
        hex = hex.slice(0, 1) + hex.charAt(0) + hex.slice(1);
        hex = hex.slice(0, 2) + hex.charAt(2) + hex.slice(2);
        hex = hex.slice(0, 4) + hex.charAt(4) + hex.slice(4);
        hex += 'FF';
        return hex; 
    }

    self.GraphicsEngine = GraphicsEngine;
}