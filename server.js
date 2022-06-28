const mongoose = require('mongoose');

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

const testimonialsRouter = require('./routes/testimonials.routes');
const concertsRouter = require('./routes/concerts.routes');
const seatsRouter = require('./routes/seats.routes');
const {SocketAddress} = require('net');

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.static(path.join(__dirname, '/client/build')));

app.use('/api', testimonialsRouter);
app.use('/api', concertsRouter);
app.use('/api', seatsRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});
io.on('connection', socket => {
  console.log('New socket!');
  socket.on('setOrdered', reason => {
    socket.broadcast.emit('seatsUpdated');
  });
  socket.on('disconnect', reason => {
    console.log(reason);
  });
});

const NODE_ENV = process.env.NODE_ENV;
let dbUri = '';

if (NODE_ENV === 'production') dbUri = 'mongodb+srv://borek84:koWxmTiin6TA3iJBV@cluster0.xytziry.mongodb.net/?retryWrites=true&w=majority';
else if (NODE_ENV === 'test') dbUri = 'mongodb://localhost:27017/NewWaveDBtest';
else dbUri = 'mongodb://localhost:27017/NewWaveDB';

mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.once('open', () => {
  console.log(NODE_ENV);
  if (!NODE_ENV) console.log('Connected to the database ' + NODE_ENV);
});
db.on('error', err => console.log('Error ' + err));

server.listen(PORT, err => {
  if (err) console.log(err);
  console.log('Server running on Port', PORT);
});

module.exports = server;
