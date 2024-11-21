const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/collaborative-editor', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Document Schema and Model
const documentSchema = new mongoose.Schema({ content: String });
const Document = mongoose.model('Document', documentSchema);

const users = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', ({ username }) => {
    users[socket.id] = username;
    io.emit('users', Object.values(users));
    Document.findOne({}, (err, doc) => {
      if (err) return console.error(err);
      socket.emit('document', doc ? doc.content : '');
    });
  });

  socket.on('editDocument', (content) => {
    Document.findOneAndUpdate({}, { content }, { upsert: true }, (err) => {
      if (err) return console.error(err);
      io.emit('document', content);
    });
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('users', Object.values(users));
    console.log('A user disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
