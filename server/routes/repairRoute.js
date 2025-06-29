const express = require('express');
const formidable = require('express-formidable');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const {
    createRepairController,
    getAllRepairsController,
    getRepairController,
    getUserRepairsController,
    updateRepairController,
    deleteRepairController,
    getRepairPhotoController,
    searchRepairsByCategoryController,
    getRecentJobsController,
    getRecentRepairsController
} = require('../controllers/repairController');
const repairModel = require('../models/repairModel');

const router = express.Router();

// Create repair job (requires authentication)
router.post('/create-repair', requireSignIn, formidable(), createRepairController);

// Get all repair jobs (public - for homepage)
router.get('/get-all-repairs', getAllRepairsController);

// Get recent repair jobs (public - for tradesperson dashboard)
router.get('/recent-jobs', getRecentJobsController);

// Get recent repair jobs (admin only - for admin dashboard)
router.get('/recent-repairs', requireSignIn, isAdmin, getRecentRepairsController);

// Get repair by ID (public)
router.get('/get-repair/:id', getRepairController);

// Get user's repair jobs (requires authentication)
router.get('/get-user-repairs', requireSignIn, getUserRepairsController);

// Update repair job (requires authentication - owner only)
router.put('/update-repair/:id', requireSignIn, updateRepairController);

// Delete repair job (requires authentication - owner only)
router.delete('/delete-repair/:id', requireSignIn, deleteRepairController);

// Get repair photo (public)
router.get('/repair-photo/:id/:photoIndex', getRepairPhotoController);

// Test endpoint to check photo storage (temporary)
router.get('/test-photos/:id', async (req, res) => {
    try {
        const repair = await repairModel.findById(req.params.id);
        if (!repair) {
            return res.status(404).send({ message: "Repair not found" });
        }
        res.json({
            repairId: repair._id,
            photoCount: repair.photos ? repair.photos.length : 0,
            hasPhotos: repair.photos && repair.photos.length > 0,
            photoTypes: repair.photos ? repair.photos.map(p => p.contentType) : []
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Search repairs by category (public)
router.get('/search-by-category/:category', searchRepairsByCategoryController);

module.exports = router; 