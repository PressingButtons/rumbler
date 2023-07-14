import express from 'express';
import bodyParser from 'body-parser';
import RumblerIO from './rumbler_io.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const PORT = process.env.port || 3000;
const app  = express( );

const _dir = dirname(fileURLToPath(import.meta.url));

const server = createServer(app);

const io = new Server( server );

RumblerIO(io);

app.use( cors({
    origin: 'http://localhost'
}));

server.listen( PORT, err => {
    if( err ) throw err; 
    console.log( 'Server initialized, running on port', PORT);
});