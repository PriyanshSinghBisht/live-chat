const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 4001;
const server = app.listen(PORT, ()=> console.log(`listening to port ${PORT}`));

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

const socketsCollection = new Set();

io.on('connection', (socket)=>{
    socketsCollection.add(socket.id);
    console.log(`socket connected to ${socket.id}`);

    io.emit('clients-total', socketsCollection.size)
    socket.on('disconnect', ()=>{
        console.log(`socket disconnected to ${socket.id}`);
        socketsCollection.delete(socket.id);
    })

    socket.on('message', data =>{
        socket.broadcast.emit('chat-message', data);
    });
   
    socket.on('feedback', data =>{
        socket.broadcast.emit('feedback', data);
    })
})