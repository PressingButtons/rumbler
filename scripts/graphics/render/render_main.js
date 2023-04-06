const RenderEngine = (function( ) {
    
    const matrices = new Array(4).fill(0).map( x => new Float32Array(16));
    const buffers = { };
    const instructor = new RenderInstructions( );

    function getTexture(key) {
        return cache[key] || cache['placeholder'];
    }

    function objectTransform(object, matrix) {
        glMatrix.mat4.fromTranslation(matrix, object.position);
        glMatrix.mat4.rotateX(matrix, matrix, object.rotation[0]);
        glMatrix.mat4.rotateY(matrix, matrix, object.rotation[1]);
        glMatrix.mat4.rotateZ(matrix, matrix, object.rotation[2]);
        glMatrix.mat4.translate(matrix, matrix, [-object.size[0]/2, -object.size[1]/2, 0]);
        glMatrix.mat4.scale(matrix, matrix, object.size);
        return matrix;
    }

    function textureTransform(object, matrix) {
        const x = object.cell[0] * object.size[0];
        const y = object.cell[1] * object.size[1];
        glMatrix.mat4.fromTranslation(matrix, [x, y, 1]);
        glMatrix.mat4.scale(matrix, matrix, object.inverted_size);
    }

    function defineBuffer(key, data) {

    }

    return {
        drawSquare: function(object) {
            instructor.clear( );
            instructor.buffer = 'square';
        },

        drawTexture: function(object) {

        },

        drawPattern: function(object) {

        },

        drawSprite: function(object) {

        },

        drawObject: function(object) {
            
        },

        setProjection: function(object) {
            glMatrix.mat4.ortho(matrices[0], object.left, object.right, object.bottom, object.top, 1, -1);
        }
    }

})( );

//setting routes for messaging 
messenger.setRoute('render-instance', message => {
    RenderEngine.setProjection(message.projection);
    for(const object of message.objects) RenderEngine.drawObject(object);
});