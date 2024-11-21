const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/multiplayer-game', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Player Schema and Model
const playerSchema = new mongoose.Schema({
  username: String,
  password: String,
  stats: {
    gamesPlayed: Number,
    gamesWon: Number
  }
});
const Player = mongoose.model('Player', playerSchema);

// Authentication Endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const newPlayer = new Player({ username, password, stats: { gamesPlayed: 0, gamesWon: 0 } });
  newPlayer.save((err, player) => {
    if (err) return res.status(500).send(err);
    res.status(201).send(player);
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  Player.findOne({ username, password }, (err, player) => {
    if (err) return res.status(500).send(err);
    if (!player) return res.status(404).send('Player not found');
    res.status(200).send(player);
  });
});

// Real-time Game Updates
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join_game', (data) => {
    socket.join(data.gameId);
    io.to(data.gameId).emit('new_player', data.username);
  });

  socket.on('game_update', (data) => {
    io.to(data.gameId).emit('update', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
