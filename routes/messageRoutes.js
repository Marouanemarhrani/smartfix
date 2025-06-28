const express = require('express');
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes protégées par authentification
router.post('/', auth, messageController.createMessage);
router.get('/problem/:problemId', auth, messageController.getProblemMessages);
router.get('/conversations', auth, messageController.getConversations);

module.exports = router; 