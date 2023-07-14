import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const socket = io("localhost", { reconnectionDelayMax: 2000 });

socket.on('user_losupergin', ( ) => {
    console.log('user login request');
})

export default {
    socket: socket
}