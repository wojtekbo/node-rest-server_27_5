const Concert = require('../models/concert.model');

exports.getAll = async (req, res) => {
  try {
    const con = await Concert.find({});
    res.json(con);
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Concert.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const con = await Concert.findOne().skip(rand);
    if (!con) res.status(404).json({message: 'Not found'});
    else res.json(con);
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.getById = async (req, res) => {
  try {
    const con = await Concert.findById(req.params.id);
    if (!con) res.status(404).json({message: 'Not found'});
    else res.json(con);
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.getByPerformer = async (req, res) => {
  try {
    const performer = req.params.performer;
    const perf = await Concert.find({performer: performer});
    if (!perf) res.status(404).json({message: 'Not found'});
    else res.json(perf);
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.getByGenere = async (req, res) => {
  try {
    const genre = req.params.genre;
    const gen = await Concert.find({genre: genre});
    if (!gen) res.status(404).json({message: 'Not found'});
    else res.json(gen);
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.getByPrice = async (req, res) => {
  try {
    const priceMin = req.params.price_min;
    const priceMax = req.params.price_max;
    const con = await Concert.find({
      price: {$gte: priceMin, $lte: priceMax},
    });
    if (!con) res.status(404).json({message: 'Not found'});
    else res.json(con);
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.getByDay = async (req, res) => {
  try {
    const day = req.params.day;
    const da = await Concert.find({day: day});
    if (!da) res.status(404).json({message: 'Not found'});
    else res.json(da);
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.postNew = async (req, res) => {
  try {
    const {performer, genre, price, day, image} = req.body;
    const con = new Concert({
      performer: performer,
      genre: genre,
      price: price,
      day: day,
      image: image,
    });
    await con.save();
    res.json({message: 'OK'});
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.putById = async (req, res) => {
  const {performer, genre, price, day, image} = req.body;
  try {
    const con = await Concert.findById(req.params.id);
    if (con) {
      con.performer = performer;
      con.genre = genre;
      con.price = price;
      con.day = day;
      con.image = image;
      await con.save();
      res.json({message: 'OK', document: con});
    } else res.status(404).json({message: 'Not found...'});
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.delById = async (req, res) => {
  try {
    const con = await Concert.findById(req.params.id);
    if (con) {
      await con.deleteOne();
      res.json(con);
    } else res.status(404).json({message: 'Not found...'});
  } catch (err) {
    res.status(500).json({message: err});
  }
};
