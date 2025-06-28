const Payment = require('../models/Payment');
const Problem = require('../models/Problem');
const Quote = require('../models/Quote');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPayment = async (req, res) => {
  try {
    const { problemId, quoteId } = req.body;
    const userId = req.user.userId;

    // Vérifier si le problème et le devis existent
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problème non trouvé' });
    }

    const quote = await Quote.findById(quoteId);
    if (!quote) {
      return res.status(404).json({ message: 'Devis non trouvé' });
    }

    // Vérifier si l'utilisateur a le droit de créer un paiement
    if (problem.client_id !== userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Réparation: ${problem.title}`,
              description: quote.description
            },
            unit_amount: quote.amount * 100 // Stripe utilise les centimes
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/problems/${problemId}?payment=success`,
      cancel_url: `${process.env.FRONTEND_URL}/problems/${problemId}?payment=cancelled`
    });

    // Créer l'enregistrement du paiement
    const paymentId = await Payment.create({
      problemId,
      quoteId,
      amount: quote.amount,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Paiement initié avec succès',
      paymentId,
      sessionId: session.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProblemPayments = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const userId = req.user.userId;

    // Vérifier si l'utilisateur a le droit de voir les paiements
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problème non trouvé' });
    }

    if (problem.client_id !== userId && problem.artisan_id !== userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const payments = await Payment.findByProblemId(problemId);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getQuotePayments = async (req, res) => {
  try {
    const quoteId = req.params.quoteId;
    const userId = req.user.userId;

    // Vérifier si l'utilisateur a le droit de voir les paiements
    const quote = await Quote.findById(quoteId);
    if (!quote) {
      return res.status(404).json({ message: 'Devis non trouvé' });
    }

    if (quote.artisan_id !== userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const payments = await Payment.findByQuoteId(quoteId);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const paymentId = req.params.id;
    const userId = req.user.userId;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    // Vérifier si l'utilisateur a le droit de modifier le statut
    const problem = await Problem.findById(payment.problem_id);
    if (problem.client_id !== userId && problem.artisan_id !== userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await Payment.updateStatus(paymentId, status);
    res.json({ message: 'Statut mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 