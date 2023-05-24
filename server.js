const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createTroop', (data) => {
    socket.broadcast.emit('createTroop', data);
  });

  socket.on('moveTroop', (data) => {
    socket.broadcast.emit('moveTroop', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

http.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});