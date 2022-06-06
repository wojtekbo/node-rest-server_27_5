const express = require('express');
const router = express.Router();
var uniqid = require('uniqid');
let db = require('../db');
db = db.seats;

router.get('/', (req, res) => {
  // db.length === 0 ? res.status(200).json({message: 'Seats database is empty'}) :
  res.json(db);
});

router.get('/random', (req, res) => {
  let randomIdx = Math.floor(Math.random() * db.length);
  const randomElement = db[randomIdx];
  !randomElement ? res.status(400).json({message: 'Seats database is empty'}) : res.json(randomElement);
});

router.get('/:id', (req, res) => {
  const selectedElement = db.filter(element => element.id === req.params.id.toString());
  selectedElement.length === 0 ? res.status(400).json({message: 'No such element in database'}) : res.json(selectedElement);
});

router.put('/:id', (req, res) => {
  const {day, seat, client, email} = req.body;
  if (!day) {
    res.status(400).json({message: 'Missing: day'});
  } else if (!seat) {
    res.status(400).json({message: 'Missing: seat'});
  } else if (!client) {
    res.status(400).json({message: 'Missing: client'});
  } else if (!email) {
    res.status(400).json({message: 'Missing: email'});
  } else {
    const indexToPut = db.findIndex(elem => elem.id == req.params.id);
    db[indexToPut].day = req.body.day;
    db[indexToPut].seat = req.body.seat;
    db[indexToPut].client = req.body.client;
    db[indexToPut].email = req.body.email;
    res.json({message: 'Updated'});
  }
});

router.post('/', (req, res) => {
  const {day, seat, client, email} = req.body;
  const sameSeat = db.filter(element => element.seat == req.body.seat);
  const sameDay = sameSeat.some(seat => seat.day == req.body.day);
  if (!day) {
    res.status(400).json({message: 'Missing: day'});
  } else if (!seat) {
    res.status(400).json({message: 'Missing: seat'});
  } else if (!client) {
    res.status(400).json({message: 'Missing: client'});
  } else if (!email) {
    res.status(400).json({message: 'Missing: email'});
  } else if (sameDay) {
    res.status(400).json({message: 'The slot is already taken...'});
  } else {
    db.push({...req.body, id: uniqid()});
    res.json({message: 'Added'});
    req.io.emit('seatsUpdated', db);
  }
});

router.delete('/:id', (req, res) => {
  const elementToDelete = db.findIndex(elem => elem.id == req.params.id);
  if (elementToDelete == -1) {
    res.status(400).json({message: 'No such element in database'});
  } else {
    db.splice(elementToDelete, 1);
    res.json({message: 'Deleted'});
  }
});

module.exports = router;
