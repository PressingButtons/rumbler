const fp = require('fs').promises;

module.exports = (path, express, app) => {

  const createFolder = (req, res) => {
    const name = getName(req);
    const dest = path.join(__dirname, req.url);
    fp.mkdir(dest)
    .then(x => res.status(200).send('successfully created directory: ' + name))
    .catch( err => res.status(400).send(err.message));
  }

  const getName = req => {
    return req.params.url.substring(req.params.url.lastIndexOf('/') + 1).split('.');
  }

  const saveStages = async (req, res) => {
    const data = req.body;
    for(const stage in data) data[stage]['map'] = await uploadStageImages(stage, data[stage]['map']);
    await fp.writeFile(path.join(__dirname, 'assets/stages/config.json'));
  };

  const sendDirectory = (req, res) => {
    fp.readdir(path.join(__dirname, req.url))
    .then(files => res.status(200).send(...files))
    .catch(err => res.status(400).send(err));
  }

  const sendFile = (res, url) => {
    res.sendFile(path.join(__dirname, url));
  }

  const send404 = (req, res) => {
    sendFile(res, '/editor/html/404.html');
  }

  const sendHome = (req, res) => {
    sendFile(res, '/editor/html/home.html');
  }

  const sendPage = (req, res) => {
    sendFile(res, `/editor/pages/${req.params.url}`);
  }

  const writeFile = (req, res) => {
    const name = getName(req);
    fp.writeFile()
  }

  const uploadStageImages = async (name, buffers) => {
    const baseURL = path.join(__dirname, '/assets/stages/maps');
    await fp.writeFile(path.join(baseURL, name, '/collision.webp'), buffers.collision);
    await fp.writeFile(path.join(baseURL, name, '/layer0.webp'), buffers.layers[0]);
    await fp.writeFile(path.join(baseURL, name, '/layer1.webp'), buffers.layers[1]);
    await fp.writeFile(path.join(baseURL, name, '/layer2.webp'), buffers.layers[2]);
  }

  app.use('/public', express.static(path.join(__dirname, '/editor/public')));
  app.use('/forms', express.static(path.join(__dirname, '/editor/forms')));
  app.use('/code', express.static(path.join(__dirname, '/javascript')));

  //Getters
  app.get('/', (req, res) => res.redirect('/home'));
  app.get('/home', sendHome);
  app.get('/assets/*', (req, res) => sendFile(res, req.url));
  app.get('/dir/*', sendDirectory);
  app.get('/page/:url', sendPage);
  app.get('/*', send404);
  //Posters
  app.post('/stages', saveStages);

}
