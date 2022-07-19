const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express( );
const PORT = 8000;

app.use('/public', express.static(path.join(__dirname, '/editor/public')));
app.use('/code', express.static(path.join(__dirname, '/javascript')));

app.get('/', (req, res) => {
  res.redirect('/home');
})

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'editor/html/home.html'));
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'editor/html/404.html'));
})

app.listen(PORT, (err) => {
  if(err) throw err;
  console.log('development server listening on port', PORT)
})
