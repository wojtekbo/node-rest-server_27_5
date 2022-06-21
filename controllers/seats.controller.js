const Seat = require('../models/seat.model');

exports.getAll = async (req, res) => {
  try {
    const se = await Seat.find({});
    res.json(se);
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Seat.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const se = await Seat.findOne().skip(rand);
    if (!se) res.status(404).json({message: 'Not found'});
    else res.json(se);
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.getById = async (req, res) => {
  try {
    const se = await Seat.findById(req.params.id);
    if (!se) res.status(404).json({message: 'Not found'});
    else res.json(se);
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.postNew = async (req, res) => {
  try {
    const {day, seat, client, email} = req.body;
    const se = new Seat({
      day: day,
      seat: seat,
      client: client,
      email: email,
    });
    await se.save();
    res.json({message: 'OK'});
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.putById = async (req, res) => {
  const {day, seat, client, email} = req.body;
  try {
    const se = await Seat.findById(req.params.id);
    if (se) {
      se.day = day;
      se.seat = seat;
      se.client = client;
      se.email = email;
      await se.save();
      res.json({message: 'OK', document: se});
    } else res.status(404).json({message: 'Not found...'});
  } catch (err) {
    res.status(500).json({message: err});
  }
};

exports.delById = async (req, res) => {
  try {
    const se = await Seat.findById(req.params.id);
    if (se) {
      await se.deleteOne();
      res.json(se);
    } else res.status(404).json({message: 'Not found...'});
  } catch (err) {
    res.status(500).json({message: err});
  }
};
