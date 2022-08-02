const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fsPromises = require('fs').promises;
const app = express( );
const PORT = 8000;

app.use('/public', express.static(path.join(__dirname, '/editor/public')));
app.use('/forms', express.static(path.join(__dirname, '/editor/forms')));
app.use('/code', express.static(path.join(__dirname, '/javascript')));

app.get('/', (req, res) => {
  res.redirect('/home');
})

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'editor/html/home.html'));
});

app.get('/data/:type/:name', (req, res) => {
  const url = path.join(__dirname, `data/${req.params.type}/${req.params.name}`);
  res.sendFile(url);
});

app.get('/image/:name', (req, res) => {
  const url = path.join(__dirname, `image/${req.params.name}.webp`);
  res.sendFile(url);
});

app.get('/save/:type/:name', async (req, res) => {
  const url = path.join(__dirname, `data/${req.params.type}/${req.params.name}`);
  try {
    await fsPromises.writeFile(path, req.body);
  } catch(err) {
    console.error(err);
  }
});

app.get('/imagelist', async (req, res) => {
  try {
    const files = await fsPromises.readdir(path.join(__dirname, 'images'), {withFileTypes: true});
    let list = files.map(x => x.name).filter(x => x.includes('.webp'));
    console.log(list);
    res.send(list);
  } catch(err) {
    console.error(err);
  }
});

app.get('/pages/:name', (req, res) => {
  res.sendFile(path.join(__dirname, `editor/pages/${req.params.name}.html`));
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'editor/html/404.html'));
})

app.listen(PORT, (err) => {
  if(err) throw err;
  console.log('development server listening on port', PORT)
})
