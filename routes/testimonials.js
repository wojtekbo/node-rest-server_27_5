const express = require('express');
const router = express.Router();
var uniqid = require('uniqid');
let db = require('../db');
db = db.testimonials;

router.get('/', (req, res) => {
  db.length === 0 ? res.status(400).json({message: 'Testimonials database is empty'}) : res.json(db);
});

router.get('/random', (req, res) => {
  let randomIdx = Math.floor(Math.random() * db.length);
  const randomElement = db[randomIdx];
  !randomElement ? res.status(400).json({message: 'Testimonials database is empty'}) : res.json(randomElement);
});

router.get('/:id', (req, res) => {
  const selectedElement = db.filter(element => element.id === req.params.id.toString());
  selectedElement.length === 0 ? res.status(400).json({message: 'No such element in database'}) : res.json(selectedElement);
});

router.put('/:id', (req, res) => {
  const {author, text} = req.body;
  if (!author) {
    res.status(400).json({message: 'Missing: author'});
  } else if (!text) {
    res.status(400).json({message: 'Missing: text'});
  } else {
    const indexToPut = db.findIndex(elem => elem.id == req.params.id);
    db[indexToPut].author = req.body.author;
    db[indexToPut].text = req.body.text;
    res.json({message: 'Updated'});
  }
});

router.post('/', (req, res) => {
  const {author, text} = req.body;
  if (!author) {
    res.status(400).json({message: 'Missing: author'});
  } else if (!text) {
    res.status(400).json({message: 'Missing: text'});
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
