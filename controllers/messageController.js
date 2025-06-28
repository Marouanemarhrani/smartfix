const Message = require('../models/Message');
const Problem = require('../models/Problem');

exports.createMessage = async (req, res) => {
  try {
    const { problemId, receiverId, content } = req.body;
    const senderId = req.user.userId;

    // Vérifier si le problème existe
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problème non trouvé' });
    }

    // Vérifier si l'utilisateur a le droit d'envoyer un message
    if (problem.client_id !== senderId && problem.artisan_id !== senderId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const messageId = await Message.create({
      problemId,
      senderId,
      receiverId,
      content
    });

    res.status(201).json({
      message: 'Message envoyé avec succès',
      messageId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProblemMessages = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const userId = req.user.userId;

    // Vérifier si l'utilisateur a le droit de voir les messages
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problème non trouvé' });
    }

    if (problem.client_id !== userId && problem.artisan_id !== userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const messages = await Message.findByProblemId(problemId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const conversations = await Message.findConversations(userId);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 