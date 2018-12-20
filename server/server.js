const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const {generateMessage, generateLocationMessage} = require('./utils/message');
const { isRealString } = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected')

  socket.on('join', (params, cb) => {
    console.log('params', params)
    const roomName = params.room.toLowerCase();
    if(!isRealString(params.name) || !isRealString(roomName)) {
      return cb('name and room name are required')
    };

    socket.join(roomName);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, roomName);

    io.to(roomName).emit('updateUserList', users.getUserList(roomName))

    socket.emit('newMessage', generateMessage('admin','welcome to the chat'));
    socket.broadcast.to(roomName).emit('newMessage', generateMessage('admin',`${params.name} joined`));
    cb();
  })

  socket.on('createMessage', (newMessage, cb) => {
    console.log('createMessage', newMessage)
    const user = users.getUser(socket.id);
    if (user && isRealString(newMessage.text)) {
      io.emit('newMessage', generateMessage(user.name, newMessage.text))
    }
    cb()
  })

  socket.on('createLocationMessage', (coords) => {
    const user = users.getUser(socket.id);
    if (user) {
      io.emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected')
    const user = users.removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('admin', `${user.name} has left`));
    }
  })

})

server.listen(port, () => {
  console.log('Server is running on port '+ port)
})