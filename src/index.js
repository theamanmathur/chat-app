/*jshint esversion: 6 */
/*jshint esversion: 7 */
/*jshint esversion: 8 */
/* jshint -W097 */
/* jshint -W117 */
'use strict';

const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const {
    generateMessage,
    generateLocationMessage
} = require('./utils/messages');
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
} = require('./utils/users');

const express = require('express');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
    console.log('New websocket connection');


    socket.on('join', ({
        username,
        room
    }, callback) => {

        const {
            error,
            user
        } = addUser({
            id: socket.id,
            username,
            room
        });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        /**
         * io.to.emit >> emit an event to everybody in a room
         * socket.broadcast.to.emit >> emit an event to everyone   in a room except one client.
         */

        socket.emit('message', generateMessage('🛡️Admin',`🎉 Hey ${user.username}, welcome to the ${user.room.toUpperCase()} room.`));
        socket.broadcast.to(user.room).emit('message', generateMessage('🛡️Admin',`${user.username} has joined! 🎉🎉`));

        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        });

        callback();

    });


    socket.on('sendMsg', (msg, callback) => {

        const user = getUser(socket.id);

        const filter = new Filter();

        if (filter.isProfane(msg)) {
            return callback("Profanity is not allowed!!");
        }

        io.to(user.room).emit('message', generateMessage(`➤ ${user.username}`,msg));
        callback();
    });

    socket.on('sendLoc', (coords, callback) => {

        const user = getUser(socket.id);

        io.to(user.room).emit('locationMessage', generateLocationMessage(`➤ ${user.username}`,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', generateMessage('🛡️ Admin',`${user.username} has left the room.🏃`));
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});