const express = require('express');
const { requireSignIn, isTradesperson } = require('../middlewares/authMiddleware');
const {
    createQuoteController,
    getQuotesForRepairController,
    acceptQuoteController,
    getTradespersonQuotesController,
    updateQuoteController,
    deleteQuoteController,
    getTradespersonStatsController,
    getTradespersonRecentQuotesController
} = require('../controllers/quoteController');

const router = express.Router();

// Create quote (requires tradesperson authentication)
router.post('/create-quote', requireSignIn, isTradesperson, createQuoteController);

// Get quotes for a repair job (public)
router.get('/get-quotes/:repairId', getQuotesForRepairController);

// Accept quote (requires authentication - repair owner only)
router.put('/accept-quote/:quoteId', requireSignIn, acceptQuoteController);

// Get tradesperson's quotes (requires tradesperson authentication)
router.get('/get-tradesperson-quotes', requireSignIn, isTradesperson, getTradespersonQuotesController);

// Get tradesperson statistics (requires tradesperson authentication)
router.get('/tradesperson-stats', requireSignIn, isTradesperson, getTradespersonStatsController);

// Get tradesperson's recent quotes (requires tradesperson authentication)
router.get('/tradesperson-quotes', requireSignIn, isTradesperson, getTradespersonRecentQuotesController);

// Update quote (requires tradesperson authentication - owner only)
router.put('/update-quote/:quoteId', requireSignIn, isTradesperson, updateQuoteController);

// Delete quote (requires tradesperson authentication - owner only)
router.delete('/delete-quote/:quoteId', requireSignIn, isTradesperson, deleteQuoteController);

module.exports = router; 