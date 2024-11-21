const socket = io();

function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(player => {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('player').innerText = player.username;
  });
}

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(player => {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('player').innerText = player.username;
  });
}

function joinGame() {
  const gameId = 'game1';  // Example game ID
  const username = document.getElementById('player').innerText;

  socket.emit('join_game', { gameId, username });

  socket.on('update', data => {
    document.getElementById('game-updates').innerHTML += `<p>${data}</p>`;
  });
}
