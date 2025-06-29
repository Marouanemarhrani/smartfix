const express = require('express');
const { 
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
} = require('../controllers/userController');
const { isAdmin, isTradesperson, requireSignIn } = require('../middlewares/authMiddleware');

const router = express.Router();

// Routing
// Register a new user
router.post('/register', registerController);

// Register a new tradesperson
router.post('/register-tradesperson', registerTradespersonController);

// Login user
router.post('/login', loginController);

// Protected user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

// Protected admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

// Protected tradesperson route auth
router.get("/tradesperson-auth", requireSignIn, isTradesperson, (req, res) => {
    res.status(200).send({ ok: true });
});

// Update profile
router.put('/profile', requireSignIn, updateProfileController);

// Update tradesperson profile
router.put('/tradesperson-profile', requireSignIn, isTradesperson, updateTradespersonProfileController);

// Update address
router.put('/update-address', requireSignIn, updateAddressController);

// Delete user account
router.delete('/delete-account', requireSignIn, deleteUserController);

// Get all tradespeople (public)
router.get('/get-all-tradespeople', getAllTradespeopleController);

// Get tradespeople by specialization (public)
router.get('/get-tradespeople/:specialization', getTradespeopleBySpecializationController);

// Admin routes
// Get all users (admin only)
router.get('/all-users', requireSignIn, isAdmin, getAllUsersController);

// Get tradespeople only (admin only)
router.get('/tradespeople', requireSignIn, isAdmin, getTradespeopleController);

// Get admin statistics (admin only)
router.get('/admin-stats', requireSignIn, isAdmin, getAdminStatsController);

// Get recent users (admin only)
router.get('/recent-users', requireSignIn, isAdmin, getRecentUsersController);

// Get recent tradespeople (admin only)
router.get('/recent-tradespeople', requireSignIn, isAdmin, getRecentTradespeopleController);

module.exports = router;
