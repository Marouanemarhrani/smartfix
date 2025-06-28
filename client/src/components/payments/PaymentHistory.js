import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { problemId } = useParams();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/payments/problem/${problemId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setPayments(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [problemId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Aucun paiement trouvé
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Historique des paiements</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {payments.map((payment) => (
          <div key={payment.id} className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  Devis de {payment.artisan_name}
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {payment.amount} €
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(payment.created_at).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  payment.status
                )}`}
              >
                {payment.status === 'completed'
                  ? 'Payé'
                  : payment.status === 'pending'
                  ? 'En attente'
                  : 'Échoué'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory; 