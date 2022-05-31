const express = require('express');
var cors = require('cors');
const path = require('path');
var uniqid = require('uniqid');
const db = require('./db');
const app = express();

const testimonialsRouter = require('./routes/testimonials.js');
const concertsRouter = require('./routes/concerts');
const seatsRouter = require('./routes/seats');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Serve static files from the React app
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

app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});
