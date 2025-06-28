const Quote = require('../models/Quote');
const Problem = require('../models/Problem');

exports.createQuote = async (req, res) => {
  try {
    const { problemId, amount, description } = req.body;
    const artisanId = req.user.userId;

    // Vérifier si le problème existe et est disponible
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problème non trouvé' });
    }

    if (problem.status !== 'pending') {
      return res.status(400).json({ message: 'Ce problème n\'est plus disponible' });
    }

    const quoteId = await Quote.create({
      problemId,
      artisanId,
      amount,
      description
    });

    res.status(201).json({
      message: 'Devis créé avec succès',
      quoteId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProblemQuotes = async (req, res) => {
  try {
    const quotes = await Quote.findByProblemId(req.params.problemId);
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyQuotes = async (req, res) => {
  try {
    const artisanId = req.user.userId;
    const quotes = await Quote.findByArtisanId(artisanId);
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuoteStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const quoteId = req.params.id;
    const userId = req.user.userId;

    const quote = await Quote.findById(quoteId);
    if (!quote) {
      return res.status(404).json({ message: 'Devis non trouvé' });
    }

    // Vérifier si l'utilisateur a le droit de modifier le statut
    const problem = await Problem.findById(quote.problem_id);
    if (problem.client_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await Quote.updateStatus(quoteId, status);

    // Si le devis est accepté, mettre à jour le statut du problème
    if (status === 'accepted') {
      await Problem.updateStatus(quote.problem_id, 'in_progress');
    }

    res.json({ message: 'Statut mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 