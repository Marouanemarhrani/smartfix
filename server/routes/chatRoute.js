const express = require('express');
const formidable = require('express-formidable');
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

// Send message (requires authentication)
router.post('/send-message', requireSignIn, sendMessageController);

// Get chat messages (requires authentication - chat participant only)
router.get('/get-messages/:chatId', requireSignIn, getChatMessagesController);

// Get user's chats (requires authentication)
router.get('/get-user-chats', requireSignIn, getUserChatsController);

// Mark messages as read (requires authentication - chat participant only)
router.put('/mark-read/:chatId', requireSignIn, markMessagesAsReadController);

// Get chat attachment (requires authentication - chat participant only)
router.get('/get-attachment/:chatId/:messageIndex/:attachmentIndex', requireSignIn, getChatAttachmentController);

module.exports = router; 