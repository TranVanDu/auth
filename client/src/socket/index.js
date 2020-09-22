import io from 'socket.io-client';
import { getCookie } from '../helpers/session';

const endpoint = 'http://localhost:5000';
let socket = null;

const onConnected = () => {
    console.log('socket: connected');
};

const onDisconnect = () => {
    console.log('socket: Disconnect');
};

export const configSocket = () => {
    if (socket && socket.disconnected) {
        socket.connect();
    }
    if (socket) return;

    socket = io.connect(endpoint, {
        query: {
            token: getCookie('insta_token'),
        },
    });

    socket.on('connect', onConnected);
    socket.on('disconnect', onDisconnect);

    return socket;
};

export const socketDisconnect = () => {
    socket.disconnect();
};

export const getSocket = () => {
    return socket;
};
