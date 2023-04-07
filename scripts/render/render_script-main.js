importScripts('./glmatrix-min.js', '../webworker/webworker_messenger.js', './render_class-glengine.js', './render_class-render-engine.js');



messenger.setRoute('init', async function(message) {
    try {
        const url = new URL('../shaders/config.json', message.uri);
        self.gl_engine = new glEngine(message.canvas);
        self.render_engine = new RenderEngine(message.uri);
        const config = await fetch(url).then(res => res.json( ));
        for(const program_name in config) {
            const vertex = await fetch(new URL(config[program_name].vertex, message.uri)).then(res => res.text( ));
            const fragment = await fetch(new URL(config[program_name].fragment, message.uri)).then(res => res.text( ));
            await gl_engine.compile(program_name, vertex, fragment);
        }
        messenger.send('init', [true, Object.keys(config)]);
    } catch (err) {
        messenger.send('init', [false, err]);
    }
});

messenger.setRoute('color-fill', message => {
    gl_engine.fill(message);
});

messenger.setRoute('draw-texture', message => {
    render_engine.drawTexture(message);
});