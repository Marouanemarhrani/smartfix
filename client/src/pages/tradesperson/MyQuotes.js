import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import TradespersonMenu from '../../components/Layout/TradespersonMenu';
import axios from 'axios';
import './MyQuotes.css';
import { toast } from 'react-hot-toast';

const MyQuotes = () => {
  const [auth] = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API}/api/quotes/get-tradesperson-quotes`);
      setQuotes(res.data.quotes);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Error loading quotes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'status-pending',
      'accepted': 'status-accepted',
      'rejected': 'status-rejected',
      'completed': 'status-completed'
    };
    return `status-badge ${statusClasses[status] || 'status-pending'}`;
  };

  const filteredQuotes = quotes.filter(quote => {
    if (filter === 'all') return true;
    return quote.status === filter;
  });

  if (loading) {
    return (
      <div className="my-quotes-container">
        <TradespersonMenu />
        <div className="quotes-content">
          <div className="loading">Loading quotes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-quotes-container">
      <TradespersonMenu />
      
      <div className="quotes-content">
        <div className="quotes-header">
          <h1>My Quotes</h1>
          <p>Manage and track your submitted quotes</p>
        </div>

        <div className="quotes-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({quotes.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({quotes.filter(q => q.status === 'pending').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'accepted' ? 'active' : ''}`}
            onClick={() => setFilter('accepted')}
          >
            Accepted ({quotes.filter(q => q.status === 'accepted').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({quotes.filter(q => q.status === 'rejected').length})
          </button>
        </div>

        <div className="quotes-list">
          {filteredQuotes.length > 0 ? (
            filteredQuotes.map((quote) => (
              <div key={quote._id} className="quote-card">
                <div className="quote-header">
                  <div className="quote-title">
                    <h3>{quote.repair?.title || 'Repair Job'}</h3>
                    <span className={getStatusBadge(quote.status)}>
                      {quote.status}
                    </span>
                  </div>
                  <div className="quote-amount">
                    ${quote.price}
                  </div>
                </div>

                <div className="quote-details">
                  <div className="detail-row">
                    <span className="detail-label">Description:</span>
                    <span className="detail-value">{quote.description}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Estimated Duration:</span>
                    <span className="detail-value">{quote.estimatedDuration}</span>
                  </div>
                  
                  {quote.materials && quote.materials.length > 0 && (
                    <div className="detail-row">
                      <span className="detail-label">Materials:</span>
                      <span className="detail-value">{quote.materials.join(', ')}</span>
                    </div>
                  )}
                  
                  <div className="detail-row">
                    <span className="detail-label">Client:</span>
                    <span className="detail-value">
                      {quote.repair?.client?.firstname} {quote.repair?.client?.lastname}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{quote.repair?.location}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Submitted:</span>
                    <span className="detail-value">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {quote.validUntil && (
                    <div className="detail-row">
                      <span className="detail-label">Valid Until:</span>
                      <span className="detail-value">
                        {new Date(quote.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {quote.status === 'accepted' && (
                  <div className="quote-actions">
                    <a href={`/chat/${quote.repair?._id}`} className="action-btn chat-btn">
                      <i className="fas fa-comments"></i>
                      Chat with Client
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-quotes">
              <i className="fas fa-file-invoice-dollar"></i>
              <h3>No quotes found</h3>
              <p>
                {filter === 'all' 
                  ? "You haven't submitted any quotes yet. Browse available jobs to get started!"
                  : `No ${filter} quotes found.`
                }
              </p>
              {filter === 'all' && (
                <a href="/" className="browse-jobs-btn">
                  Browse Available Jobs
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyQuotes; 