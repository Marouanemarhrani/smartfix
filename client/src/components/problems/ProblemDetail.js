import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProblemDetail = () => {
  const [problem, setProblem] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [problemRes, quotesRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/problems/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8080/api/quotes/problem/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setProblem(problemRes.data);
        setQuotes(quotesRes.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleQuoteStatus = async (quoteId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:8080/api/quotes/${quoteId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Mettre à jour les devis
      const quotesRes = await axios.get(`http://localhost:8080/api/quotes/problem/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuotes(quotesRes.data);

      // Mettre à jour le problème
      const problemRes = await axios.get(`http://localhost:8080/api/problems/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProblem(problemRes.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Une erreur est survenue');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {problem.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Signalé le {new Date(problem.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{problem.description}</dd>
            </div>
            {problem.image_url && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Image</dt>
                <dd className="mt-1">
                  <img
                    src={`http://localhost:5000${problem.image_url}`}
                    alt="Problème"
                    className="max-w-lg rounded-lg shadow-lg"
                  />
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm font-medium text-gray-500">Statut</dt>
              <dd className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${problem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    problem.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    problem.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'}`}>
                  {problem.status}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Devis reçus
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {quotes.length === 0 ? (
            <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
              Aucun devis reçu pour le moment
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {quotes.map((quote) => (
                <li key={quote.id} className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {quote.artisan_name}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {quote.description}
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {quote.amount}€
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {problem.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleQuoteStatus(quote.id, 'accepted')}
                            className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-700"
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() => handleQuoteStatus(quote.id, 'rejected')}
                            className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-700"
                          >
                            Refuser
                          </button>
                        </div>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'}`}>
                        {quote.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail; 