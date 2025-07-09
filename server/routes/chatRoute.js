const express = require('express');
const formidable = require('formidable');
const { requireSignIn } = require('../middlewares/authMiddleware');
const {
    createChatController,
    sendMessageController,
    getChatMessagesController,
    getUserChatsController,
    markMessagesAsReadController,
    getChatAttachmentController,
} = require('../controllers/chatController');

const router = express.Router();

// Create chat (requires authentication)
router.post('/create-chat', requireSignIn, createChatController);

// Middleware to use formidable only for multipart/form-data
function maybeFormidable(req, res, next) {
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) return res.status(400).send({ error: 'Error parsing form data' });
      req.fields = fields;
      req.files = files;
      next();
    });
  } else {
    next();
  }
}

// Send message (requires authentication)
router.post('/send-message', requireSignIn, maybeFormidable, sendMessageController);

// Get chat messages (requires authentication - chat participant only)
router.get('/get-messages/:chatId', requireSignIn, getChatMessagesController);

// Get user's chats (requires authentication)
router.get('/get-user-chats', requireSignIn, getUserChatsController);

// Mark messages as read (requires authentication - chat participant only)
router.put('/mark-read/:chatId', requireSignIn, markMessagesAsReadController);

// Get chat attachment (requires authentication - chat participant only)
router.get('/get-attachment/:chatId/:messageIndex/:attachmentIndex', requireSignIn, getChatAttachmentController);

module.exports = router; 