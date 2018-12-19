const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected')

  socket.emit('newMessage', generateMessage('admin','welcome to the chat'));
  socket.broadcast.emit('newMessage', generateMessage('admin','new user joined'));

  socket.on('createMessage', (newMessage, cb) => {
    console.log('createMessage', newMessage)
    io.emit('newMessage', generateMessage(newMessage.from, newMessage.text))
    cb('this is from the server')
  })

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('admin', coords.latitude, coords.longitude));
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected')
  })

})

server.listen(port, () => {
  console.log('Server is running on port '+ port)
})