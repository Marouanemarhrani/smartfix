import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ quote }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { problemId } = useParams();

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
        'http://localhost:8080/api/payments',
        {
          problemId,
          quoteId: quote.id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const stripe = await stripePromise;
      const { sessionId } = response.data;

      // Rediriger vers la page de paiement Stripe
      const result = await stripe.redirectToCheckout({
        sessionId
      });

      if (result.error) {
        setError(result.error.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Paiement</h2>
      
      <div className="mb-4">
        <p className="text-gray-600">Montant à payer :</p>
        <p className="text-2xl font-bold text-green-600">{quote.amount} €</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Chargement...' : 'Payer maintenant'}
      </button>
    </div>
  );
};

export default PaymentForm; 