const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const routing = require('./routing.js');
const app = express( );
const PORT = 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
routing(path, express, app);
app.listen(PORT, (err) => {
  if(err) throw err;
  console.log('development server listening on port', PORT)
})
