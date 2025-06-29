const JWT = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Protected Routes token base
const requireSignIn = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).send({
                success: false,
                message: "Authorization header is required",
            });
        }

        // Extract token from "Bearer <token>" format
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : authHeader;

        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Token is required",
            });
        }

        const decode = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decode;   
        next();
    } catch (error) {
        console.log('Auth middleware error:', error);
        res.status(401).send({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

// Admin access
const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "User not found",
            });
        }
        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "You can't access to this page!",
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: "Error in admin middleware",
        });
    }
};

// Tradesperson access
const isTradesperson = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "User not found",
            });
        }
        if (user.role !== 3) {
            return res.status(401).send({
                success: false,
                message: "You can't access to this page!",
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: "Error in tradesperson middleware",
        });
    }
};

module.exports = {
    requireSignIn,
    isAdmin,
    isTradesperson
};
