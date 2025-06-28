const express = require('express');
const quoteController = require('../controllers/quoteController');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes protégées par authentification
router.post('/', auth, quoteController.createQuote);
router.get('/problem/:problemId', auth, quoteController.getProblemQuotes);
router.get('/my-quotes', auth, quoteController.getMyQuotes);
router.patch('/:id/status', auth, quoteController.updateQuoteStatus);

module.exports = router; 