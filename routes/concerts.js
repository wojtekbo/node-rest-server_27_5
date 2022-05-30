const express = require('express');
const router = express.Router();
var uniqid = require('uniqid');
let db = require('../db');
db = db.concerts;

router.get('/', (req, res) => {
  db.length === 0 ? res.status(400).json({message: 'Concerts database is empty'}) : res.json(db);
});

router.get('/random', (req, res) => {
  let randomIdx = Math.floor(Math.random() * db.length);
  const randomElement = db[randomIdx];
  !randomElement ? res.status(400).json({message: 'Concerts database is empty'}) : res.json(randomElement);
});

router.get('/:id', (req, res) => {
  const selectedElement = db.filter(element => element.id === req.params.id.toString());
  selectedElement.length === 0 ? res.status(400).json({message: 'No such element in database'}) : res.json(selectedElement);
});

router.put('/:id', (req, res) => {
  const {performer, genre, price, day, image} = req.body;
  if (!performer) {
    res.status(400).json({message: 'Missing: performer'});
  } else if (!genre) {
    res.status(400).json({message: 'Missing: genre'});
  } else if (!price) {
    res.status(400).json({message: 'Missing: price'});
  } else if (!day) {
    res.status(400).json({message: 'Missing: day'});
  } else if (!image) {
    res.status(400).json({message: 'Missing: image'});
  } else {
    const indexToPut = db.findIndex(elem => elem.id == req.params.id);
    db[indexToPut].performer = req.body.performer;
    db[indexToPut].genre = req.body.genre;
    db[indexToPut].price = req.body.price;
    db[indexToPut].day = req.body.day;
    db[indexToPut].image = req.body.image;
    res.json({message: 'Updated'});
  }
});

router.post('/', (req, res) => {
  const {performer, genre, price, day, image} = req.body;
  if (!performer) {
    res.status(400).json({message: 'Missing: performer'});
  } else if (!genre) {
    res.status(400).json({message: 'Missing: genre'});
  } else if (!price) {
    res.status(400).json({message: 'Missing: price'});
  } else if (!day) {
    res.status(400).json({message: 'Missing: day'});
  } else if (!image) {
    res.status(400).json({message: 'Missing: image'});
  } else {
    db.push({...req.body, id: uniqid()});
    res.json({message: 'Added'});
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
