const express = require('express');
const router = express.Router();
const ConcertsController = require('../controllers/concerts.controller');

router.get('/concerts', ConcertsController.getAll);
router.get('/concerts/random', ConcertsController.getRandom);
router.get('/concerts/:id', ConcertsController.getById);
router.get('/concerts/performer/:performer', ConcertsController.getByPerformer);
router.get('/concerts/genre/:genre', ConcertsController.getByGenere);
router.get('/concerts/price/:price_min/:price_max', ConcertsController.getByPrice);
// router.get('/concerts/price/day/:day', ConcertsController.getByDay);
router.get('/concerts/day/:day', ConcertsController.getByDay);
router.post('/concerts', ConcertsController.postNew);
router.put('/concerts/:id', ConcertsController.putById);
router.delete('/concerts/:id', ConcertsController.delById);

module.exports = router;
