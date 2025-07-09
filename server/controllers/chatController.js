const chatModel = require("../models/chatModel");
const repairModel = require("../models/repairModel");
const userModel = require("../models/userModel");
const fs = require("fs");

// Create chat
const createChatController = async (req, res) => {
    try {
        const { repairId, tradespersonId } = req.body;

        if (!repairId) return res.status(400).send({ error: "Repair ID is required" });
        if (!tradespersonId) return res.status(400).send({ error: "Tradesperson ID is required" });

        // Check if repair exists
        const repair = await repairModel.findById(repairId);
        if (!repair) {
            return res.status(404).send({ error: "Repair job not found" });
        }

        // Check if tradesperson exists
        const tradesperson = await userModel.findById(tradespersonId);
        if (!tradesperson || tradesperson.role !== 3) {
            return res.status(404).send({ error: "Tradesperson not found" });
        }

        // Check if chat already exists
        const existingChat = await chatModel.findOne({
            repair: repairId,
            client: req.user._id,
            tradesperson: tradespersonId
        });

        if (existingChat) {
            return res.status(200).send({
                success: true,
                message: "Chat already exists",
                chat: existingChat
            });
        }

        // Create new chat
        const chat = new chatModel({
            repair: repairId,
            client: req.user._id,
            tradesperson: tradespersonId
        });

        await chat.save();

        // Populate the chat with user details
        await chat.populate('repair', 'title');
        await chat.populate('client', 'firstname lastname');
        await chat.populate('tradesperson', 'firstname lastname');

        res.status(201).send({
            success: true,
            message: 'Chat created successfully',
            chat,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error creating chat',
            error,
        });
    }
};

// Send message
const sendMessageController = async (req, res) => {
    try {
        const { chatId, content, messageType = 'text' } = req.body;
        // No attachments support for now

        if (!chatId) return res.status(400).send({ error: "Chat ID is required" });
        if (!content) return res.status(400).send({ error: "Message content is required" });

        const chat = await chatModel.findById(chatId);
        if (!chat) {
            return res.status(404).send({ error: "Chat not found" });
        }

        // Check if user is part of this chat
        if (chat.client.toString() !== req.user._id.toString() && 
            chat.tradesperson.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: "You are not part of this chat" });
        }

        const message = {
            sender: req.user._id,
            content,
            messageType,
            timestamp: new Date()
        };

        // Handle attachments
        if (attachments && attachments.length > 0) {
            const attachmentArray = Array.isArray(attachments) ? attachments : [attachments];
            message.attachments = attachmentArray.map(file => ({
                data: fs.readFileSync(file.path),
                contentType: file.type,
                filename: file.name
            }));
        }

        chat.messages.push(message);
        chat.lastMessage = new Date();
        await chat.save();

        res.status(200).send({
            success: true,
            message: 'Message sent successfully',
            message: message
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error sending message',
            error,
        });
    }
};

// Get chat messages
const getChatMessagesController = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findById(chatId)
            .populate('messages.sender', 'firstname lastname')
            .populate('repair', 'title')
            .populate('client', 'firstname lastname')
            .populate('tradesperson', 'firstname lastname');

        if (!chat) {
            return res.status(404).send({ error: "Chat not found" });
        }

        // Check if user is part of this chat
        if (chat.client._id.toString() !== req.user._id.toString() && 
            chat.tradesperson._id.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: "You are not part of this chat" });
        }

        res.status(200).send({
            success: true,
            message: "Chat messages retrieved successfully",
            chat,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving chat messages",
            error,
        });
    }
};

// Get user's chats
const getUserChatsController = async (req, res) => {
    try {
        const chats = await chatModel.find({
            $or: [
                { client: req.user._id },
                { tradesperson: req.user._id }
            ]
        })
        .populate('repair', 'title status')
        .populate('client', 'firstname lastname')
        .populate('tradesperson', 'firstname lastname')
        .sort({ lastMessage: -1 });

        res.status(200).send({
            success: true,
            message: "User chats retrieved successfully",
            chats,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving user chats",
            error,
        });
    }
};

// Mark messages as read
const markMessagesAsReadController = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findById(chatId);
        if (!chat) {
            return res.status(404).send({ error: "Chat not found" });
        }

        // Check if user is part of this chat
        if (chat.client.toString() !== req.user._id.toString() && 
            chat.tradesperson.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: "You are not part of this chat" });
        }

        // Mark messages as read for the other user
        chat.messages.forEach(message => {
            if (message.sender.toString() !== req.user._id.toString()) {
                message.read = true;
            }
        });

        await chat.save();

        res.status(200).send({
            success: true,
            message: 'Messages marked as read',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error marking messages as read',
            error,
        });
    }
};

// Get chat attachment
const getChatAttachmentController = async (req, res) => {
    try {
        const { chatId, messageIndex, attachmentIndex } = req.params;

        const chat = await chatModel.findById(chatId);
        if (!chat) {
            return res.status(404).send({ error: "Chat not found" });
        }

        const message = chat.messages[messageIndex];
        if (!message || !message.attachments) {
            return res.status(404).send({ error: "Attachment not found" });
        }

        const attachment = message.attachments[attachmentIndex];
        if (!attachment) {
            return res.status(404).send({ error: "Attachment not found" });
        }

        res.set("Content-type", attachment.contentType);
        res.status(200).send(attachment.data);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving attachment",
            error,
        });
    }
};

module.exports = {
    createChatController,
    sendMessageController,
    getChatMessagesController,
    getUserChatsController,
    markMessagesAsReadController,
    getChatAttachmentController,
}; 