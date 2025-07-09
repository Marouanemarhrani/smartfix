const repairModel = require("../models/repairModel");
const quoteModel = require("../models/quoteModel");
const chatModel = require("../models/chatModel");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

// Create repair job
const createRepairController = async (req, res) => {
    try {
        const { title, description, category, location, urgency, budget } = req.fields;
        const { photos } = req.files;

        // Validation
        if (!title) return res.status(400).send({ error: "Title is required" });
        if (!description) return res.status(400).send({ error: "Description is required" });
        if (!category) return res.status(400).send({ error: "Category is required" });
        if (!location) return res.status(400).send({ error: "Location is required" });

        const repair = new repairModel({
            ...req.fields,
            client: req.user._id
        });

        // Handle photo uploads
        if (photos) {
            const photoArray = Array.isArray(photos) ? photos : [photos];
            repair.photos = photoArray.map(photo => ({
                data: fs.readFileSync(photo.path),
                contentType: photo.type
            }));
            repair.markModified('photos');
        }
        await repair.save();
        
        res.status(201).send({
            success: true,
            message: 'Repair job created successfully',
            repair,
        });
    } catch (error) {
        console.error('Error in createRepairController:', error);
        res.status(500).send({
            success: false,
            message: 'Error creating repair job',
            error,
        });
    }
};

// Get all repair jobs (for homepage)
const getAllRepairsController = async (req, res) => {
    try {
        const repairs = await repairModel.find({ status: 'open' })
            .populate('client', 'firstname lastname')
            .sort({ createdAt: -1 });

        // Add photo count to each repair and exclude photo data
        const repairsWithPhotoCount = repairs.map(repair => {
            const repairObj = repair.toObject();
            repairObj.photoCount = repair.photos ? repair.photos.length : 0;
            // Remove the actual photo data to reduce response size
            delete repairObj.photos;
            return repairObj;
        });

        res.status(200).send({
            success: true,
            message: "Repair jobs retrieved successfully",
            repairs: repairsWithPhotoCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving repair jobs",
            error,
        });
    }
};

// Get repair by ID
const getRepairController = async (req, res) => {
    try {
        const repair = await repairModel.findById(req.params.id)
            .populate('client', 'firstname lastname email phone')
            .populate('acceptedQuote')
            .populate({
                path: 'acceptedQuote',
                populate: {
                    path: 'tradesperson',
                    select: 'firstname lastname email phone rating totalReviews'
                }
            });

        if (!repair) {
            return res.status(404).send({
                success: false,
                message: "Repair job not found",
            });
        }

        res.status(200).send({
            success: true,
            message: "Repair job details retrieved successfully",
            repair,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving repair job details",
            error,
        });
    }
};

// Get user's repair jobs
const getUserRepairsController = async (req, res) => {
    try {
        const repairs = await repairModel.find({ client: req.user._id })
            .populate({
                path: 'acceptedQuote',
                populate: {
                    path: 'tradesperson',
                    select: 'firstname lastname email phone rating totalReviews _id'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "User repair jobs retrieved successfully",
            repairs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving user repair jobs",
            error,
        });
    }
};

// Update repair job
const updateRepairController = async (req, res) => {
    try {
        const repair = await repairModel.findByIdAndUpdate(
            req.params.id,
            req.fields,
            { new: true }
        );

        if (!repair) {
            return res.status(404).send({
                success: false,
                message: "Repair job not found",
            });
        }

        res.status(200).send({
            success: true,
            message: 'Repair job updated successfully',
            repair,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error updating repair job',
            error,
        });
    }
};

// Delete repair job
const deleteRepairController = async (req, res) => {
    try {
        const repair = await repairModel.findByIdAndDelete(req.params.id);

        if (!repair) {
            return res.status(404).json({ success: false, message: 'Repair job not found' });
        }

        res.json({ success: true, message: 'Repair job deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get repair photo
const getRepairPhotoController = async (req, res) => {
    try {
        console.log('Photo request - Repair ID:', req.params.id, 'Photo Index:', req.params.photoIndex);
        const repair = await repairModel.findById(req.params.id);
        
        if (!repair) {
            console.log('Repair not found');
            return res.status(404).send({ message: "Repair not found" });
        }
        
        console.log('Repair found, photos:', repair.photos ? repair.photos.length : 0);
        
        if (repair.photos && repair.photos.length > 0) {
            const photoIndex = parseInt(req.params.photoIndex) || 0;
            console.log('Requested photo index:', photoIndex);
            
            if (photoIndex < repair.photos.length) {
                const photo = repair.photos[photoIndex];
                console.log('Photo found, content type:', photo.contentType);
                res.set("Content-type", photo.contentType);
                return res.status(200).send(photo.data);
            } else {
                console.log('Photo index out of range');
                return res.status(404).send({ message: "Photo index out of range" });
            }
        }
        
        console.log('No photos found');
        res.status(404).send({ message: "Photo not found" });
    } catch (error) {
        console.error('Error in getRepairPhotoController:', error);
        res.status(500).send({
            success: false,
            message: "Error retrieving photo",
            error,
        });
    }
};

// Search repairs by category
const searchRepairsByCategoryController = async (req, res) => {
    try {
        const { category } = req.params;
        const repairs = await repairModel.find({ 
            category: category,
            status: 'open'
        })
        .populate('client', 'firstname lastname')
        .select("-photos")
        .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "Repairs by category retrieved successfully",
            repairs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error searching repairs by category",
            error,
        });
    }
};

// Get recent repair jobs (for tradesperson dashboard)
const getRecentJobsController = async (req, res) => {
    try {
        const repairs = await repairModel.find({ status: 'open' })
            .populate('client', 'firstname lastname')
            .select("-photos")
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).send({
            success: true,
            message: "Recent repair jobs retrieved successfully",
            repairs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving recent repair jobs",
            error,
        });
    }
};

// Get recent repair jobs (for admin dashboard)
const getRecentRepairsController = async (req, res) => {
    try {
        const repairs = await repairModel.find({})
            .populate('client', 'firstname lastname')
            .select("-photos")
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).send({
            success: true,
            message: "Recent repair jobs retrieved successfully",
            repairs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error retrieving recent repair jobs",
            error,
        });
    }
};

module.exports = {
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
}; 