importScripts('./glmatrix-min.js', '../webworker/webworker_messenger.js', './render_class-glengine.js', './render_class-render-engine.js');



messenger.setRoute('init', async function(message) {
    try {
        const url = new URL('../shaders/config.json', message.uri);
        self.gl_engine = new glEngine(message.canvas);
        self.render_engine = new RenderEngine( );

        const config = await fetch(url).then(res => res.json( ));
        for(const program_name in config) {
            const vertex = await fetch(new URL(config[program_name].vertex, message.uri)).then(res => res.text( ));
            const fragment = await fetch(new URL(config[program_name].fragment, message.uri)).then(res => res.text( ));
            await gl_engine.compile(program_name, vertex, fragment);
        }
        //defining buffers 
        gl_engine.defineBuffer('square', [0, 0, 1, 0, 0, 1, 1, 1]);
        messenger.send('init', [true, Object.keys(config)]);
    } catch (err) {
        messenger.send('init', [false, err]);
    }
});

messenger.setRoute('color-fill', message => {
    gl_engine.fill(message);
});

messenger.setRoute('preload', message => {
    for(const key in message) {
        render_engine.cacheTexture(key, message[key]);
    }
    messenger.send('preload', 'complete');
})

messenger.setRoute('render', message => {
    render_engine.setProjection(message.projection);
    render_engine.render(message.objects, gl_engine);
});