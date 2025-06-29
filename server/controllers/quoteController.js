const quoteModel = require("../models/quoteModel");
const repairModel = require("../models/repairModel");
const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel");

// Create quote
const createQuoteController = async (req, res) => {
    try {
        const { repairId, price, description, estimatedDuration, materials } = req.body;

        // Validation
        if (!repairId) return res.status(400).send({ error: "Repair ID is required" });
        if (!price) return res.status(400).send({ error: "Price is required" });
        if (!description) return res.status(400).send({ error: "Description is required" });
        if (!estimatedDuration) return res.status(400).send({ error: "Estimated duration is required" });

        // Check if repair exists and is open
        const repair = await repairModel.findById(repairId);
        if (!repair) {
            return res.status(404).send({ error: "Repair job not found" });
        }
        if (repair.status !== 'open') {
            return res.status(400).send({ error: "Repair job is not open for quotes" });
        }

        // Check if tradesperson already submitted a quote
        const existingQuote = await quoteModel.findOne({
            repair: repairId,
            tradesperson: req.user._id
        });

        if (existingQuote) {
            return res.status(400).send({ error: "You have already submitted a quote for this repair" });
        }

        // Set quote validity (7 days from now)
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 7);

        const quote = new quoteModel({
            repair: repairId,
            tradesperson: req.user._id,
            price,
            description,
            estimatedDuration,
            materials: materials || [],
            validUntil
        });

        await quote.save();

        res.status(201).send({
            success: true,
            message: 'Quote submitted successfully',
            quote,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error submitting quote',
            error,
        });
    }
};

// Get quotes for a repair job
const getQuotesForRepairController = async (req, res) => {
    try {
        const { repairId } = req.params;
        
        const quotes = await quoteModel.find({ repair: repairId })
            .populate('tradesperson', 'firstname lastname rating totalReviews specialization experience')
            .sort({ price: 1 });

        res.status(200).send({
            success: true,
            message: "Quotes retrieved successfully",
            quotes,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving quotes",
            error,
        });
    }
};

// Accept quote
const acceptQuoteController = async (req, res) => {
    try {
        const { quoteId } = req.params;

        const quote = await quoteModel.findById(quoteId)
            .populate('repair')
            .populate('tradesperson');

        if (!quote) {
            return res.status(404).send({ error: "Quote not found" });
        }

        // Check if user owns the repair
        if (quote.repair.client.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: "You can only accept quotes for your own repair jobs" });
        }

        // Check if quote is still valid
        if (new Date() > quote.validUntil) {
            return res.status(400).send({ error: "Quote has expired" });
        }

        // Update repair status and accepted quote
        await repairModel.findByIdAndUpdate(quote.repair._id, {
            status: 'in_progress',
            acceptedQuote: quoteId
        });

        // Update quote status
        await quoteModel.findByIdAndUpdate(quoteId, {
            status: 'accepted'
        });

        // Create chat between client and tradesperson
        const chat = new chatModel({
            repair: quote.repair._id,
            client: req.user._id,
            tradesperson: quote.tradesperson._id
        });

        await chat.save();

        res.status(200).send({
            success: true,
            message: 'Quote accepted successfully',
            chatId: chat._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error accepting quote',
            error,
        });
    }
};

// Get tradesperson's quotes
const getTradespersonQuotesController = async (req, res) => {
    try {
        const quotes = await quoteModel.find({ tradesperson: req.user._id })
            .populate({
                path: 'repair',
                select: 'title description category location urgency budget',
                populate: {
                    path: 'client',
                    select: 'firstname lastname'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "Tradesperson quotes retrieved successfully",
            quotes,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving tradesperson quotes",
            error,
        });
    }
};

// Update quote
const updateQuoteController = async (req, res) => {
    try {
        const { price, description, estimatedDuration, materials } = req.body;
        const { quoteId } = req.params;

        const quote = await quoteModel.findById(quoteId);

        if (!quote) {
            return res.status(404).send({ error: "Quote not found" });
        }

        // Check if tradesperson owns the quote
        if (quote.tradesperson.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: "You can only update your own quotes" });
        }

        // Check if quote is still pending
        if (quote.status !== 'pending') {
            return res.status(400).send({ error: "Can only update pending quotes" });
        }

        const updatedQuote = await quoteModel.findByIdAndUpdate(
            quoteId,
            {
                price,
                description,
                estimatedDuration,
                materials: materials || quote.materials
            },
            { new: true }
        );

        res.status(200).send({
            success: true,
            message: 'Quote updated successfully',
            quote: updatedQuote,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error updating quote',
            error,
        });
    }
};

// Delete quote
const deleteQuoteController = async (req, res) => {
    try {
        const { quoteId } = req.params;

        const quote = await quoteModel.findById(quoteId);

        if (!quote) {
            return res.status(404).send({ error: "Quote not found" });
        }

        // Check if tradesperson owns the quote
        if (quote.tradesperson.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: "You can only delete your own quotes" });
        }

        await quoteModel.findByIdAndDelete(quoteId);

        res.status(200).send({
            success: true,
            message: 'Quote deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error deleting quote',
            error,
        });
    }
};

// Get tradesperson statistics
const getTradespersonStatsController = async (req, res) => {
    try {
        const tradespersonId = req.user._id;

        // Get total quotes
        const totalQuotes = await quoteModel.countDocuments({ tradesperson: tradespersonId });

        // Get accepted quotes
        const acceptedQuotes = await quoteModel.countDocuments({ 
            tradesperson: tradespersonId, 
            status: 'accepted' 
        });

        // Get pending quotes
        const pendingQuotes = await quoteModel.countDocuments({ 
            tradesperson: tradespersonId, 
            status: 'pending' 
        });

        // Calculate total earnings (sum of accepted quotes)
        const acceptedQuotesData = await quoteModel.find({ 
            tradesperson: tradespersonId, 
            status: 'accepted' 
        });
        const totalEarnings = acceptedQuotesData.reduce((sum, quote) => sum + quote.price, 0);

        // Get active chats count
        const activeChats = await chatModel.countDocuments({ tradesperson: tradespersonId });

        const stats = {
            totalQuotes,
            acceptedQuotes,
            pendingQuotes,
            totalEarnings,
            activeChats
        };

        res.status(200).send({
            success: true,
            message: "Tradesperson statistics retrieved successfully",
            stats,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving tradesperson statistics",
            error,
        });
    }
};

// Get tradesperson's recent quotes
const getTradespersonRecentQuotesController = async (req, res) => {
    try {
        const quotes = await quoteModel.find({ tradesperson: req.user._id })
            .populate({
                path: 'repair',
                select: 'title description category location urgency budget',
                populate: {
                    path: 'client',
                    select: 'firstname lastname'
                }
            })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).send({
            success: true,
            message: "Tradesperson recent quotes retrieved successfully",
            quotes,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving tradesperson recent quotes",
            error,
        });
    }
};

module.exports = {
    createQuoteController,
    getQuotesForRepairController,
    acceptQuoteController,
    getTradespersonQuotesController,
    updateQuoteController,
    deleteQuoteController,
    getTradespersonStatsController,
    getTradespersonRecentQuotesController
}; 