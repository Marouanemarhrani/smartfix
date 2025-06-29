import React, { useState, useEffect } from 'react';
import LayoutNF from '../../components/Layout/LayoutNF';
import AdminMenu from '../../components/Layout/AdminMenu';
import { useAuth } from '../../context/auth';
import axios from 'axios';
import "./AdminDashboard.css";
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [auth] = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTradespeople: 0,
    totalRepairs: 0,
    totalQuotes: 0,
    pendingRepairs: 0,
    completedRepairs: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTradespeople, setRecentTradespeople] = useState([]);
  const [recentRepairs, setRecentRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const statsRes = await axios.get(`${process.env.REACT_APP_API}/api/users/admin-stats`);
      const usersRes = await axios.get(`${process.env.REACT_APP_API}/api/users/recent-users`);
      const tradespeopleRes = await axios.get(`${process.env.REACT_APP_API}/api/users/recent-tradespeople`);
      const repairsRes = await axios.get(`${process.env.REACT_APP_API}/api/repairs/recent-repairs`);
      
      setStats(statsRes.data.stats);
      setRecentUsers(usersRes.data.users);
      setRecentTradespeople(tradespeopleRes.data.tradespeople);
      setRecentRepairs(repairsRes.data.repairs);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'open': 'status-open',
      'in_progress': 'status-progress',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    return `status-badge ${statusClasses[status] || 'status-open'}`;
  };

  if (loading) {
    return (
      <LayoutNF title={"Admin Dashboard"}>
        <div className='adm container-fluid m-3 p-3'>
          <div className='adm1 row'>
            <div className='adm2 col-md-3'>
              <AdminMenu />
            </div>
            <div className='adm3 col-md-9'>
              <div className="loading">Loading dashboard...</div>
            </div>
          </div>
        </div>
      </LayoutNF>
    );
  }

  return (
    <LayoutNF title={"Admin Dashboard"}>
      <div className='adm container-fluid m-3 p-3'>
        <div className='adm1 row'>
          <div className='adm2 col-md-3'>
            <AdminMenu />
          </div>
          <div className='adm3 col-md-9'>
            {/* Admin Info Card */}
            <div className='adm4-card w-75 p-3 mb-4'>
              <h4 className='adm-h4'>Admin Information</h4>
              <div className='adm5-card-content'>
                <span className='adm-labelclass'>Admin Full Name :</span>
                <span className='adm-infoclass'>{auth?.user?.firstname} {auth?.user?.lastname}</span>

                <span className='adm-labelclass'>Admin Email :</span>
                <span className='adm-infoclass'>{auth?.user?.email}</span>

                <span className='adm-labelclass'>Admin Phone :</span>
                <span className='adm-infoclass'>{auth?.user?.phone}</span>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid mb-4">
              <div className="stat-card">
                <div className="stat-icon users">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-content">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon tradespeople">
                  <i className="fas fa-tools"></i>
                </div>
                <div className="stat-content">
                  <h3>{stats.totalTradespeople}</h3>
                  <p>Total Tradespeople</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon repairs">
                  <i className="fas fa-wrench"></i>
                </div>
                <div className="stat-content">
                  <h3>{stats.totalRepairs}</h3>
                  <p>Total Repairs</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon quotes">
                  <i className="fas fa-file-invoice-dollar"></i>
                </div>
                <div className="stat-content">
                  <h3>{stats.totalQuotes}</h3>
                  <p>Total Quotes</p>
                </div>
              </div>
            </div>

            {/* Data Grid */}
            <div className="data-grid">
              {/* Recent Users */}
              <div className="data-section">
                <div className="section-header">
                  <h5>Recent Users</h5>
                  <a href="/admin/users" className="view-all">View All</a>
                </div>
                <div className="data-list">
                  {recentUsers.length > 0 ? (
                    recentUsers.map((user) => (
                      <div key={user._id} className="data-item">
                        <div className="data-header">
                          <h6>{user.firstname} {user.lastname}</h6>
                          <span className="user-role">
                            {user.role === 0 ? 'Client' : user.role === 1 ? 'Admin' : 'Tradesperson'}
                          </span>
                        </div>
                        <p className="data-email">{user.email}</p>
                        <p className="data-date">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No users found.</p>
                  )}
                </div>
              </div>

              {/* Recent Tradespeople */}
              <div className="data-section">
                <div className="section-header">
                  <h5>Recent Tradespeople</h5>
                  <a href="/admin/tradespeople" className="view-all">View All</a>
                </div>
                <div className="data-list">
                  {recentTradespeople.length > 0 ? (
                    recentTradespeople.map((tradesperson) => (
                      <div key={tradesperson._id} className="data-item">
                        <div className="data-header">
                          <h6>{tradesperson.firstname} {tradesperson.lastname}</h6>
                          <span className="specialization">{tradesperson.specialization}</span>
                        </div>
                        <p className="data-email">{tradesperson.email}</p>
                        <p className="data-rating">
                          Rating: {tradesperson.rating || 0}/5 ({tradesperson.totalReviews || 0} reviews)
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No tradespeople found.</p>
                  )}
                </div>
              </div>

              {/* Recent Repairs */}
              <div className="data-section">
                <div className="section-header">
                  <h5>Recent Repair Jobs</h5>
                  <a href="/admin/repairs" className="view-all">View All</a>
                </div>
                <div className="data-list">
                  {recentRepairs.length > 0 ? (
                    recentRepairs.map((repair) => (
                      <div key={repair._id} className="data-item">
                        <div className="data-header">
                          <h6>{repair.title}</h6>
                          <span className={getStatusBadge(repair.status)}>
                            {repair.status}
                          </span>
                        </div>
                        <p className="data-category">{repair.category}</p>
                        <p className="data-location">
                          <i className="fas fa-map-marker-alt"></i> {repair.location}
                        </p>
                        <p className="data-date">
                          Posted: {new Date(repair.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No repair jobs found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutNF>
  );
};

export default AdminDashboard;
