const express = require('express');
const router = express.Router();
const SeatsController = require('../controllers/seats.controller');

router.get('/seats', SeatsController.getAll);
router.get('/seats/random', SeatsController.getRandom);
router.get('/seats/:id', SeatsController.getById);
router.post('/seats', SeatsController.postNew);
router.put('/seats/:id', SeatsController.putById);
router.delete('/seats/:id', SeatsController.delById);

module.exports = router;
