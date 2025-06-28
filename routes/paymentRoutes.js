const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Créer un nouveau paiement
router.post('/', auth, paymentController.createPayment);

// Obtenir les paiements d'un problème
router.get('/problem/:problemId', auth, paymentController.getProblemPayments);

// Obtenir les paiements d'un devis
router.get('/quote/:quoteId', auth, paymentController.getQuotePayments);

// Mettre à jour le statut d'un paiement
router.patch('/:id/status', auth, paymentController.updatePaymentStatus);

module.exports = router; 