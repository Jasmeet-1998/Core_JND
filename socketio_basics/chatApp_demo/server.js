const path = require('path');

const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
// 🌠 creates a socket.io server with help of express & http.createServer method
const io = socketio(server);

// ✨ Server the public dir as static act as client UI
app.use(express.static(path.join(__dirname,'public')));

// ✔ Event Listener each time a new client connects to the socket server instance io 
io.on('connection',socket=>{
    console.log(`🎎 ClientId: ${socket.id} connected to websocket...`);

    // 🦨 emits a welcome message to current user
    socket.emit('message','This is SocketServer, Welcome to chatApp!');

    // 🦨 Broadcast to everyone when a user connects at frontend except the origin client(who connected)
    socket.broadcast.emit('message','User with ThisName has joined the chat');

    // 🎈 event that triggers when client disconnects
    socket.on('disconnect',()=>{
        // 🦨 broadcast message to everyone that user left the chat  
        io.emit('message','A user has left the chat');
    });

    // 🎈 Catch/Listen for chatMessage event submit by a user
    socket.on('chatMessage',(msg)=>{
        // message coming from client catched at server side
        //console.log(msg);

        // 🌠 emit the catched client message to everybody from server
        // 🦨 broadcast to everyone
        io.emit('message',msg);
    });
});



const PORT = 5000 || process.env.PORT;

server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});