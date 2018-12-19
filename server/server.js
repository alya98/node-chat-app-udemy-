const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected')

  socket.emit('newMessage', generateMessage('admin','welcome to the chat'));
  socket.broadcast.emit('newMessage', generateMessage('admin','new user joined'));

  socket.on('createMessage', (newMessage) => {
    console.log('createMessage', newMessage)
    io.emit('newMessage', generateMessage(enwMessage.from, newMessage.text))
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected')
  })

})

server.listen(port, () => {
  console.log('Server is running on port '+ port)
})