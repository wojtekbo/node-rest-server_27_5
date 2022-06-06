// const express = require('express');
// const socket = require('socket.io');
// const app = express();

// ===================

// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const {Server} = require('socket.io');
// const io = new Server(server);

const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const PORT = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);

const path = require('path');
const cors = require('cors');
const uniqid = require('uniqid');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const testimonialsRouter = require('./routes/testimonials.js');
const concertsRouter = require('./routes/concerts');
const seatsRouter = require('./routes/seats');
const {SocketAddress} = require('net');

// Serve static files from the React app
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(express.static(path.join(__dirname, '/client/build')));

app.use('/api/testimonials', testimonialsRouter);
app.use('/api/concerts', concertsRouter);
app.use('/api/seats', seatsRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

// const server = app.listen(process.env.PORT || 8000, () => {
//   console.log('Server is running on port: 8000');
// });

// const io = socket(server);

// io.on('connection', socket => {
//   console.log('New socket conected: ' + socket.id);
//   socket.on('disconnect', () => {
//     console.log('Client disconected: ' + socked.id);
//   });
// });

// =====================================

// io.on('connection', socket => {
//   console.log('a user connected' + socket.id);
//   socket.on('disconnect', () => {
//     console.log('user disconnected' + socket.id);
//   });
// });

// server.listen(8000, () => {
//   console.log('listening on *:8000');
// });

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});
io.on('connection', socket => {
  console.log('New socket!');
  socket.on('disconnect', reason => {
    console.log(reason);
  });
});

server.listen(PORT, err => {
  if (err) console.log(err);
  console.log('Server running on Port', PORT);
});
