const express = require ('express');
const path  =  require('path');
const http = require ('http');
const socketio = require ('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUserList} = require ('./utils/users');

const app = express();

const server = http.createServer(app);
const io = socketio(server);

//set static folder as front end code
app.use(express.static(path.join(__dirname, 'public')));

//declare username that send messages
const botName = 'ChatWave Bot';

//run when client connect
io.on('connection', socket => {
    //console.log('new Web Socket connection.....');

    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', formatMessage(botName,'Welcome to ChatWave!'));

        //broadcast when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined Chat Room.`));

        //send room and userList of that room
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUserList(user.room) 
        });


    });

    //listen for chat messages
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //send message when user leave room
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the Chat Room.`));

             //send room and userList of that room
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUserList(user.room) 
            });
        }
    });

})

const PORT = 3000 || process.env.PORT ;

server.listen (PORT , () => console.log(`server is running on  ${PORT}`) );