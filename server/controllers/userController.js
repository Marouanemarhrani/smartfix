const userModel = require('../models/userModel');
const { comparePassword, hashPassword } = require('../helpers/authHelper');
const JWT = require('jsonwebtoken');

// Register a new user
const registerController = async (req, res) => {
    try {
        const { firstname, lastname, email, password, phone, address } = req.body;
        
        const requiredFields = { firstname, lastname, email, password, phone, address };
        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).send({ 
                    success:false,
                    message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required for authentication!` });
            }
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "An account is already registered with this email. Login or try another email",
            });
        }

        const hashedPassword = await hashPassword(password);
        const user = new userModel({
            firstname,
            lastname,
            email,
            phone,
            address,
            password: hashedPassword,
        });
        await user.save();

        res.status(201).send({
            success: true,
            message: "Account added successfully",
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "An unexpected error occurred. Please try again.",
            error,
        });
    }
};

// Register a new tradesperson
const registerTradespersonController = async (req, res) => {
    try {
        const { 
            firstname, 
            lastname, 
            email, 
            password, 
            phone, 
            address, 
            specialization, 
            experience, 
            hourlyRate, 
            skills 
        } = req.body;
        
        const requiredFields = { 
            firstname, 
            lastname, 
            email, 
            password, 
            phone, 
            address, 
            specialization, 
            experience, 
            hourlyRate 
        };
        
        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).send({ 
                    success: false,
                    message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required for tradesperson registration!` });
            }
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "An account is already registered with this email. Login or try another email",
            });
        }

        const hashedPassword = await hashPassword(password);
        const tradesperson = new userModel({
            firstname,
            lastname,
            email,
            phone,
            address,
            password: hashedPassword,
            role: 3, // Tradesperson role
            specialization,
            experience,
            hourlyRate,
            skills: skills || []
        });
        await tradesperson.save();

        res.status(201).send({
            success: true,
            message: "Tradesperson account created successfully",
            tradesperson,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "An unexpected error occurred. Please try again.",
            error,
        });
    }
};

// Login user
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Email and password are required',
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User doesn't exist. Please register or try another email.",
            });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: "Incorrect password. Please try again.",
            });
        }

        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Prepare user data based on role
        let userData = {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
        };

        // Add tradesperson specific fields if user is a tradesperson
        if (user.role === 3) {
            userData = {
                ...userData,
                specialization: user.specialization,
                experience: user.experience,
                hourlyRate: user.hourlyRate,
                skills: user.skills,
                rating: user.rating,
                totalReviews: user.totalReviews,
                isActive: user.isActive
            };
        }

        res.status(200).send({
            success: true,
            message: "Login successful",
            user: userData,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "An unexpected error occurred during login. Please try again.",
            error,
        });
    }
};

// Update profile
const updateProfileController = async (req, res) => {
    try {
        const { firstname, lastname, email, password, phone, address } = req.body;
        const user = await userModel.findById(req.user._id);

        if (password && password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "Password is required and should be at least 6 characters long",
            });
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            firstname: firstname || user.firstname,
            lastname: lastname || user.lastname,
            email: email || user.email,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
        }, { new: true });

        res.status(200).send({
            success: true,
            message: 'Profile updated successfully',
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "There was an error in updating the profile",
            error,
        });
    }
};

// Update tradesperson profile
const updateTradespersonProfileController = async (req, res) => {
    try {
        const { 
            firstname, 
            lastname, 
            email, 
            password, 
            phone, 
            address, 
            specialization, 
            experience, 
            hourlyRate, 
            skills 
        } = req.body;
        
        const user = await userModel.findById(req.user._id);

        if (password && password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "Password is required and should be at least 6 characters long",
            });
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            firstname: firstname || user.firstname,
            lastname: lastname || user.lastname,
            email: email || user.email,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address,
            specialization: specialization || user.specialization,
            experience: experience || user.experience,
            hourlyRate: hourlyRate || user.hourlyRate,
            skills: skills || user.skills,
        }, { new: true });

        res.status(200).send({
            success: true,
            message: 'Tradesperson profile updated successfully',
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "There was an error in updating the tradesperson profile",
            error,
        });
    }
};

// Delete user account
const deleteUserController = async (req, res) => {
    try {
        // Find the user by ID and delete
        const user = await userModel.findByIdAndDelete(req.user._id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "An error occurred while deleting the account",
            error,
        });
    }
};

// Update user's address
const updateAddressController = async (req, res) => {
    try {
        const { address } = req.body;
        const updatedAddress = await userModel.findByIdAndUpdate(req.user._id, {
            address: address || req.user.address,
        }, { new: true });

        res.status(200).send({
            success: true,
            message: 'Address updated successfully',
            updatedAddress,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "There was an error in updating the address",
            error,
        });
    }
};

// Get all tradespeople
const getAllTradespeopleController = async (req, res) => {
    try {
        const tradespeople = await userModel.find({ role: 3, isActive: true })
            .select('-password')
            .sort({ rating: -1 });

        res.status(200).send({
            success: true,
            message: "Tradespeople retrieved successfully",
            tradespeople,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving tradespeople",
            error,
        });
    }
};

// Get tradespeople by specialization
const getTradespeopleBySpecializationController = async (req, res) => {
    try {
        const { specialization } = req.params;
        const tradespeople = await userModel.find({ 
            role: 3, 
            isActive: true,
            specialization: specialization 
        })
        .select('-password')
        .sort({ rating: -1 });

        res.status(200).send({
            success: true,
            message: "Tradespeople by specialization retrieved successfully",
            tradespeople,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving tradespeople by specialization",
            error,
        });
    }
};

// Get all users (admin only)
const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "Users retrieved successfully",
            users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving users",
            error,
        });
    }
};

// Get tradespeople only (admin only)
const getTradespeopleController = async (req, res) => {
    try {
        const tradespeople = await userModel.find({ role: 3 })
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "Tradespeople retrieved successfully",
            tradespeople,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving tradespeople",
            error,
        });
    }
};

// Get admin statistics
const getAdminStatsController = async (req, res) => {
    try {
        // Get total users (clients)
        const totalUsers = await userModel.countDocuments({ role: 0 });

        // Get total tradespeople
        const totalTradespeople = await userModel.countDocuments({ role: 3 });

        // Get total repairs
        const repairModel = require('../models/repairModel');
        const totalRepairs = await repairModel.countDocuments();

        // Get total quotes
        const quoteModel = require('../models/quoteModel');
        const totalQuotes = await quoteModel.countDocuments();

        // Get pending repairs
        const pendingRepairs = await repairModel.countDocuments({ status: 'open' });

        // Get completed repairs
        const completedRepairs = await repairModel.countDocuments({ status: 'completed' });

        const stats = {
            totalUsers,
            totalTradespeople,
            totalRepairs,
            totalQuotes,
            pendingRepairs,
            completedRepairs
        };

        res.status(200).send({
            success: true,
            message: "Admin statistics retrieved successfully",
            stats,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving admin statistics",
            error,
        });
    }
};

// Get recent users
const getRecentUsersController = async (req, res) => {
    try {
        const users = await userModel.find({ role: 0 })
            .select('firstname lastname email createdAt')
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).send({
            success: true,
            message: "Recent users retrieved successfully",
            users,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving recent users",
            error,
        });
    }
};

// Get recent tradespeople
const getRecentTradespeopleController = async (req, res) => {
    try {
        const tradespeople = await userModel.find({ role: 3 })
            .select('firstname lastname email specialization rating totalReviews createdAt')
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).send({
            success: true,
            message: "Recent tradespeople retrieved successfully",
            tradespeople,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving recent tradespeople",
            error,
        });
    }
};

module.exports = {
    registerController,
    registerTradespersonController,
    loginController,
    updateProfileController,
    updateTradespersonProfileController,
    updateAddressController,
    deleteUserController,
    getAllTradespeopleController,
    getTradespeopleBySpecializationController,
    getAllUsersController,
    getTradespeopleController,
    getAdminStatsController,
    getRecentUsersController,
    getRecentTradespeopleController
};
