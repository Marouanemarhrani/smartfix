const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['plumbing', 'electrical', 'carpentry', 'painting', 'hvac', 'general', 'other'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
        default: 'medium'
    },
    photos: [
  {
    data: { type: Buffer },
    contentType: { type: String }
  }
],
    status: {
        type: String,
        enum: ['open', 'in_progress', 'completed', 'cancelled'],
        default: 'open'
    },
    budget: {
        min: {
            type: Number,
            min: 0
        },
        max: {
            type: Number,
            min: 0
        }
    },
    acceptedQuote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quote"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Repair', repairSchema); 