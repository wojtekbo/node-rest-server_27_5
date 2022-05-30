const express = require('express');
var cors = require('cors');
var uniqid = require('uniqid');
const db = require('./db');
const app = express();

const testimonialsRouter = require('./routes/testimonials.js');
const concertsRouter = require('./routes/concerts');
const seatsRouter = require('./routes/seats');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/testimonials', testimonialsRouter);
app.use('/concerts', concertsRouter);
app.use('/seats', seatsRouter);

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

app.listen(8000);
