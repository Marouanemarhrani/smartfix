import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ArtisanDashboard = ({ user }) => {
  const [availableProblems, setAvailableProblems] = useState([]);
  const [myQuotes, setMyQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [problemsResponse, quotesResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/problems/available', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8080/api/quotes/my-quotes', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setAvailableProblems(problemsResponse.data);
        setMyQuotes(quotesResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Problèmes disponibles */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Problèmes disponibles</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {availableProblems.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-500">
                Aucun problème disponible pour le moment
              </li>
            ) : (
              availableProblems.map((problem) => (
                <li key={problem.id}>
                  <Link to={`/problems/${problem.id}`} className="block hover:bg-gray-50">
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {problem.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 truncate">
                            {problem.description}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              // Logique pour soumettre un devis
                            }}
                            className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-700"
                          >
                            Soumettre un devis
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {new Date(problem.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Mes devis */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mes devis</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {myQuotes.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-500">
                Vous n'avez pas encore soumis de devis
              </li>
            ) : (
              myQuotes.map((quote) => (
                <li key={quote.id}>
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {quote.problem.title}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Montant: {quote.amount}€
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'}`}>
                          {quote.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Soumis le {new Date(quote.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ArtisanDashboard; 