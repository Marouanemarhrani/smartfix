const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please use a valid phone number'],
    },
    address: {
        type: String,
        required: true,
    },
    // Tradesperson specific fields
    specialization: {
        type: String,
        enum: ['plumbing', 'electrical', 'carpentry', 'painting', 'hvac', 'general', 'other'],
        required: function() { return this.role === 3; } // Required only for tradespeople
    },
    experience: {
        type: Number, // Years of experience
        min: 0,
        required: function() { return this.role === 3; }
    },
    hourlyRate: {
        type: Number,
        min: 0,
        required: function() { return this.role === 3; }
    },
    skills: {
        type: [String], 
    },
    availability: {
        type: Map,
        of: Boolean,
        default: {} // A map to track availability (e.g., { Monday: true, Tuesday: false, ... })
    },
    isActive: {
        type: Boolean,
        default: true, // Indicates if the tradesperson is currently active
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    role: {
        type: Number,
        default: 0, // 0: client, 1: admin, 3: tradesperson
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
