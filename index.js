const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fsPromises = require('fs').promises;
const app = express( );
const PORT = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, '/editor/public')));
app.use('/forms', express.static(path.join(__dirname, '/editor/forms')));
app.use('/code', express.static(path.join(__dirname, '/javascript')));

app.get('/', (req, res) => {
  res.redirect('/home');
})

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'editor/html/home.html'));
});

app.get('/images/:name', (req, res) => {
  const url = path.join(__dirname, `images/${req.params.name}.webp`);
  res.sendFile(url);
});

app.get('/data/:name', (req, res) => {
  const url = path.join(__dirname, `data/${req.params.name}`);
  res.sendFile(url);
});

app.post('/data/:name', (req, res) => {
  const url = path.join(__dirname, `data/${req.params.name}`);
  fsPromises.writeFile(url, JSON.stringify(req.body))
  .then(x => res.status(200).send({message: "success"}))
  .catch(err => res.status(400).send({message: "failure", error: err}));
});

app.get('/imagelist', async (req, res) => {
  try {
    const files = await fsPromises.readdir(path.join(__dirname, 'images'), {withFileTypes: true});
    let list = files.map(x => x.name).filter(x => x.includes('.webp'));
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
