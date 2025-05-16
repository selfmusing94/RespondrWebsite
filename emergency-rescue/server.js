const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');
const pool = require('./config/database');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const responders = new Map();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/report', require('./routes/report'));
app.use('/api/driver', require('./routes/driver'));
app.use('/api/auth', require('./routes/auth'));

io.on('connection', (socket) => {
  socket.on('authenticate', ({ token }) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || decoded.role !== 'Responder') {
        socket.disconnect();
        return;
      }
      responders.set(decoded.user_id, socket);
      socket.user_id = decoded.user_id;
    });
  });

  socket.on('updateLocation', async ({ driverId, latitude, longitude }) => {
    try {
      await pool.query(
        `UPDATE ambulances SET latitude = ?, longitude = ?, last_updated = NOW()
         WHERE driver_id = ?`,
        [latitude, longitude, driverId]
      );
    } catch (error) {
      console.error('Location update error:', error);
    }
  });

  socket.on('disconnect', () => {
    if (socket.user_id) responders.delete(socket.user_id);
  });
});

module.exports = { io, responders };

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));