importScripts('../system/singletons/worker_messenger.js', './g_engine.js');

self.messenger.setRoute('initialize', function(message) {
    self.engine = new GraphicsEngine( message[0] );
    //
    self.engine.init(message[1]).then(( ) => {
        self.messenger.sendMessage('initialize', {status: true});
    }).catch( err => {
        self.messenger.sendMessage('initialize', {status: false, err});
    })
});

self.messenger.setRoute('fill', message => {
    self.engine.fill( message );
}); 

self.messenger.setRoute('render', message => {
    self.engine.draw( message );
})

self.messenger.setRoute('texture', message => {
    const status = self.engine.cacheTexture(message);
    self.messenger.sendMessage('texture', {status: status});
})