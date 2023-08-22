import express from 'express';
import bodyParser from 'body-parser';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { writeFile } from 'fs/promises';

const app = express( );
const port = 3001;

const _dir = path.dirname( fileURLToPath(import.meta.url));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

//
app.use('/editor', express.static('editor'));
app.use('/images', express.static('images'));
app.use('/utils', express.static('utils'));
app.use('/data', express.static('data'));

const fileURL = url => {
    return path.join( _dir, url );
}

app.get('/', (req, res) => {
    res.sendFile( fileURL('editor.html'));
});

app.get('/db.json', (req, res) => {
    res.sendFile(fileURL('db.json'));
});

app.get('/stages', (req, res) => {
    res.sendFile(fileURL('/data/stages.json'));
});


app.post('/db.json', (req, res) => {
    writeFile( fileURL('db.json'), JSON.stringify(req.body) );
    res.sendFile( fileURL('db.json') );
})

app.post('/db', (req, res) => {
    const db = req.body;
    writeFile( fileURL('/data/stages.json'), JSON.stringify({stages: db.stages}) )
    res.sendFile( fileURL('/data/stages.json') );
});

app.listen( port, err => {
    if( err ) throw err;
    console.log('editor server initialized, operating on port:', port)
})