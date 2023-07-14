{
    self.compile = async ( gl, vertex, fragment ) => {
        return  createShaders( gl, vertex, fragment )
        .then( shaders => createProgram( gl, shaders ))
        .then( program => packageProgram( gl, program, vertex, fragment ));
    }

    // creating shaders

    const createShaders = ( gl, vertex, fragment ) => {
        return new Promise((resolve, reject) => {
            resolve({
                vertex: createShader( gl, vertex, gl.VERTEX_SHADER),
                fragment: createShader( gl, fragment, gl.FRAGMENT_SHADER)
            })
        });
    }

    const createShader = ( gl, text, type ) => {
        const shader = gl.createShader( type );
        gl.shaderSource( shader, text );
        gl.compileShader( shader );
        if( gl.getShaderParameter( shader, gl.COMPILE_STATUS)) return shader;
        const err = gl.getShaderInfoLog( shader );
        gl.deleteShader( shader );
        throw err;
    }

    // creating program

    const createProgram = ( gl, shaders ) => {
        const program = gl.createProgram( );
        gl.attachShader( program, shaders.vertex );
        gl.attachShader( program, shaders.fragment );
        gl.linkProgram ( program, gl.LINK_STATUS );
        if( gl.getProgramParameter(program, gl.LINK_STATUS )) return program;
        const err = gl.getProgramInfoLog( program );
        gl.deleteProgram( program );
        throw err;
    }

    // packaging program 

    const packageProgram = ( gl, program, vertex, fragment ) => {
        return {
            program: program,
            uniforms: getUniforms( gl, program, vertex, fragment ),
            attributes: getAttributes( gl, program, vertex, fragment ),
        }
    }

    const getParameter = ( text, key ) => {
        const regex = new RegExp(`(?<=${key} ).*`, 'g');
        const results = text.match(regex);
        return results ? results.map( x => x.substring(x.lastIndexOf(' ') + 1, x.length - 1)) : [];
    }

    const getUniforms = ( gl, program, vertex, fragment ) => {
        let keys = getParameter( vertex, 'uniform');
        keys = keys.concat( getParameter( fragment, 'uniform' ));
        keys = [...new Set( keys )];
        const uniforms = { };
        for(const key of keys) uniforms[key] = gl.getUniformLocation( program, key);
        return uniforms
    }

    const getAttributes = ( gl, program, vertex, fragment ) => {
        let keys = getParameter( vertex, 'attribute');
        keys = keys.concat( getParameter( fragment, 'attribute' ));
        keys = [...new Set( keys )];
        const attributes = { };
        for(const key of keys) attributes[key] = gl.getAttribLocation( program, key);
        return attributes       
    }

}