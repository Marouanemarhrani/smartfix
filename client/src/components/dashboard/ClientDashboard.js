import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ClientDashboard = ({ user }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/problems/my-problems', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProblems(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des problèmes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mes problèmes</h2>
        <Link
          to="/new-problem"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
        >
          Nouveau problème
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {problems.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              Vous n'avez pas encore signalé de problème
            </li>
          ) : (
            problems.map((problem) => (
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${problem.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            problem.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            problem.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'}`}>
                          {problem.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="text-sm text-gray-500">
                        {new Date(problem.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {problem.quotes_count} devis reçus
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ClientDashboard; 