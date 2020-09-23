const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_KEY } = require('../config/key');

let initSocket = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.query.token;
            const payload = await jwt.verify(token, JWT_KEY);
            socket.userId = payload._id;
            next();
        } catch (error) {
            console.log('socketUseError: ', error);
        }
    });
    let clients = {};

    io.on('connection', async (socket) => {
        try {
            const user = await User.findById(socket.userId);

            if (user) {
                if (clients[user._id]) {
                    clients[user._id].push(socket.id);
                } else {
                    clients[user._id] = [socket.id];
                }
            }

            console.log('Connected: ' + user._id);

            socket.on('disconnect', () => {
                clients[user._id] = clients[user._id].filter((socketId) => {
                    socketId !== socket.id;
                });
                console.log('Disconnect: ' + user._id);
            });

            socket.on('send-message', (data) => {
                if (data.conversationType === 'ChatGroup') {
                    data.receiver.members.forEach((item) => {
                        if (clients[item]) {
                            emitNotifyToArray(
                                clients,
                                item,
                                io,
                                'res-sent-message',
                                data
                            );
                        }
                    });
                } else if (data.conversationType === 'Conversation') {
                    if (clients[data.receiver]) {
                        clients[data.receiver].forEach((socketId) => {
                            if (io.sockets.connected[socketId]) {
                                io.sockets.connected[socketId].emit(
                                    'res-send-message',
                                    data
                                );
                                io.sockets.connected[socketId].emit(
                                    'res-last-message',
                                    data
                                );
                            }
                        });
                    }

                    if (clients[data.sender._id]) {
                        clients[data.sender._id].forEach((socketId) => {
                            io.sockets.connected[socketId].emit(
                                'res-last-message',
                                data
                            );
                        });
                    }
                }
            });
        } catch (error) {
            console.log('socketError: ', error);
        }
    });
};

module.exports = initSocket;
