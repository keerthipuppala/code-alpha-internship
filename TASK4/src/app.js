import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [document, setDocument] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('document', (doc) => setDocument(doc));
    socket.on('users', (users) => setUsers(users));

    socket.emit('join', { username: 'User1' });

    return () => {
      socket.off('document');
      socket.off('users');
    };
  }, []);

  const handleChange = (e) => {
    setDocument(e.target.value);
    socket.emit('editDocument', e.target.value);
  };

  return (
    <div className="App">
      <h1>Collaborative Editor</h1>
      <textarea value={document} onChange={handleChange} />
      <div>
        <h2>Active Users:</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
