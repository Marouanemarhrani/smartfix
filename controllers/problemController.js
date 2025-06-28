const Problem = require('../models/Problem');
const multer = require('multer');
const path = require('path');

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Seuls les fichiers images sont autorisés!'));
  }
}).single('image');

exports.createProblem = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { title, description } = req.body;
      const clientId = req.user.userId;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const problemId = await Problem.create({
        clientId,
        title,
        description,
        imageUrl
      });

      res.status(201).json({
        message: 'Problème créé avec succès',
        problemId
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
};

exports.getMyProblems = async (req, res) => {
  try {
    const clientId = req.user.userId;
    const problems = await Problem.findByClientId(clientId);
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAvailableProblems = async (req, res) => {
  try {
    const problems = await Problem.findAvailable();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problème non trouvé' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProblemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const problemId = req.params.id;
    const userId = req.user.userId;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problème non trouvé' });
    }

    // Vérifier si l'utilisateur a le droit de modifier le statut
    if (problem.client_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await Problem.updateStatus(problemId, status);
    res.json({ message: 'Statut mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 