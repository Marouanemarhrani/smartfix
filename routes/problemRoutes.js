const express = require('express');
const problemController = require('../controllers/problemController');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes protégées par authentification
router.post('/', auth, problemController.createProblem);
router.get('/my-problems', auth, problemController.getMyProblems);
router.get('/available', auth, problemController.getAvailableProblems);
router.get('/:id', auth, problemController.getProblemById);
router.patch('/:id/status', auth, problemController.updateProblemStatus);

module.exports = router; 