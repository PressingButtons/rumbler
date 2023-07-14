import ECD from './error_code_database/error_code.js';

const LOGIN_TIMEOUT = 30 * 1000;

export default function RumblerIO( socket_io ) {

    const users = { };

    //methods 
    const createUser = (socket, user_name) => {
        users[user_name] = { 
            host: socket, 
            room: {
                max: 1, 
                users: new Set( )
            }
        };
    }

    const generateName = name => {
        return name +'#'+ Number(Math.round(Math.random( ) * Math.pow(15, 4))).toString(16);
    }

    const sendLoginRequest = function(socket) {
        socket.on('user_login', onLogin.bind(socket));
        clearTimeout(login_timeout);
        socket.login_timeout = setTimeout( onLoginTimeout, LOGIN_TIMEOUT, socket);
    }

    const setUser = function(socket, user_name) {
        createUser( socket, user_name );
        socket.on('connect_to_room', onConnectToRoom.bind(socket));
        socket.on('query_rooms', onQueryRooms.bind(socket));
        socket.emit('login_successful', user_name);
    }

    // Listeners 
    const onConnectToRoom = function(req) {
        if( !rooms[req] ) return socket.emit('error', ECD.code('ecf_001', req));
        socket.join( rooms[req].host.id );   
    }

    const onQueryRooms = function( socket ) {
        socket.emit('room_list', Object.keys( users ));
    }

    const onUserLogin = function( name ) {
        const user_name = generateName( name );
        if( !users[user_name] ) setUser( this, user_name);
        else sendLoginRequest( this ); 
    }

    // connecting a new socket 

    socket_io.on('connection',  socket => {
        socket.on('user_login', onUserLogin.bind(socket));
        socket.emit('user_login');
        sendLoginRequest( socket );
    });

    console.log('socket listener initialized');

} 

const error_codes = { };
