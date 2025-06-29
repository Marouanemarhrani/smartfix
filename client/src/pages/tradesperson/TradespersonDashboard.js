import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import TradespersonMenu from '../../components/Layout/TradespersonMenu';
import './TradespersonDashboard.css';
import { toast } from 'react-hot-toast';

const TradespersonDashboard = () => {
  const [auth] = useAuth();
  const [stats, setStats] = useState({
    totalQuotes: 0,
    acceptedQuotes: 0,
    pendingQuotes: 0,
    totalEarnings: 0,
    activeChats: 0
  });
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const statsRes = await axios.get(`${process.env.REACT_APP_API}/api/quotes/tradesperson-stats`);
      const quotesRes = await axios.get(`${process.env.REACT_APP_API}/api/quotes/tradesperson-quotes`);
      const jobsRes = await axios.get(`${process.env.REACT_APP_API}/api/repairs/recent-jobs`);
      
      setStats(statsRes.data.stats);
      setRecentQuotes(quotesRes.data.quotes);
      setRecentJobs(jobsRes.data.repairs);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error loading dashboard data');
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

  if (loading) {
    return (
      <div className="tradesperson-dashboard-container">
        <TradespersonMenu />
        <div className="dashboard-content">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="tradesperson-dashboard-container">
      <TradespersonMenu />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome back, {auth?.user?.firstname}!</h1>
          <p>Here's what's happening with your business today.</p>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-file-invoice-dollar"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalQuotes}</h3>
              <p>Total Quotes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon accepted">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.acceptedQuotes}</h3>
              <p>Accepted Quotes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.pendingQuotes}</h3>
              <p>Pending Quotes</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon earnings">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="stat-content">
              <h3>${stats.totalEarnings}</h3>
              <p>Total Earnings</p>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Recent Quotes */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Quotes</h2>
              <a href="/dashboard/tradesperson/my-quotes" className="view-all">View All</a>
            </div>
            <div className="quotes-list">
              {recentQuotes.length > 0 ? (
                recentQuotes.map((quote) => (
                  <div key={quote._id} className="quote-item">
                    <div className="quote-header">
                      <h4>{quote.repair.title}</h4>
                      <span className={getStatusBadge(quote.status)}>
                        {quote.status}
                      </span>
                    </div>
                    <p className="quote-amount">${quote.price}</p>
                    <p className="quote-date">
                      Submitted: {new Date(quote.createdAt).toLocaleDateString()}
                    </p>
                    {quote.materials && quote.materials.length > 0 && (
                      <div className="detail-row">
                        <span className="detail-label">Materials:</span>
                        <span className="detail-value">{quote.materials.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-data">No quotes submitted yet.</p>
              )}
            </div>
          </div>

          {/* Recent Job Opportunities */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Job Opportunities</h2>
              <a href="/" className="view-all">Browse All</a>
            </div>
            <div className="jobs-list">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <div key={job._id} className="job-item">
                    <div className="job-header">
                      <h4>{job.title}</h4>
                      <span className="job-location">
                        <i className="fas fa-map-marker-alt"></i>
                        {job.location}
                      </span>
                    </div>
                    <p className="job-description">{job.description.substring(0, 100)}...</p>
                    <div className="job-footer">
                      <span className="job-budget">Budget: ${job.budget}</span>
                      <span className="job-date">
                        Posted: {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No recent job opportunities.</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <a href="/" className="action-card">
              <i className="fas fa-search"></i>
              <h3>Browse Jobs</h3>
              <p>Find new repair opportunities</p>
            </a>
            <a href="/dashboard/tradesperson/profile" className="action-card">
              <i className="fas fa-user-edit"></i>
              <h3>Update Profile</h3>
              <p>Keep your information current</p>
            </a>
            <a href="/dashboard/tradesperson/my-quotes" className="action-card">
              <i className="fas fa-file-alt"></i>
              <h3>Manage Quotes</h3>
              <p>View and manage your quotes</p>
            </a>
            <a href="/chats" className="action-card">
              <i className="fas fa-comments"></i>
              <h3>My Chats</h3>
              <p>Communicate with clients</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradespersonDashboard; 