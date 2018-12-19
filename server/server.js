const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected')

  socket.emit('newMessage', {from: 'admin', text: 'welcome to the chat app',  createdAt: new Date().getTime()})
  socket.broadcast.emit('newMessage', {from: 'admin', text: 'new user joined',  createdAt: new Date().getTime()})

  socket.on('createMessage', (newMessage) => {
    console.log('createMessage', newMessage)
    io.emit('newMessage', {
      from: newMessage.from,
      text: newMessage.text,
      createdAt: new Date().getTime()
    })
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected')
  })

})

server.listen(port, () => {
  console.log('Server is running on port '+ port)
})