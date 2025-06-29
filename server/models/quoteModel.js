const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    repair: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repair",
        required: true
    },
    tradesperson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    estimatedDuration: {
        type: String,
        required: true // e.g., "2-3 hours", "1 day"
    },
    materials: [String],
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'expired'],
        default: 'pending'
    },
    validUntil: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema); 