import React, { useState, useEffect } from 'react';
import LayoutNF from '../../components/Layout/LayoutNF';
import UserMenu from '../../components/Layout/UserMenu';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './MyRepairs.css';

const MyRepairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingChatId, setStartingChatId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMyRepairs();
  }, []);

  const getMyRepairs = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API || 'http://localhost:8080'}/api/repairs/get-user-repairs`,
        {
          headers: {
            Authorization: localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).token : '',
          },
        }
      );
      if (data.success) {
        setRepairs(data.repairs);
      }
    } catch (error) {
      console.log(error);
      toast.error('Error fetching repair jobs');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'status-open';
      case 'in_progress':
        return 'status-progress';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-open';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'emergency':
        return 'urgency-emergency';
      case 'high':
        return 'urgency-high';
      case 'medium':
        return 'urgency-medium';
      case 'low':
        return 'urgency-low';
      default:
        return 'urgency-medium';
    }
  };

  const handleStartChat = async (repair) => {
    if (!repair.acceptedQuote || !repair.acceptedQuote.tradesperson) return;
    // Fix: handle both object and string for tradesperson
    const tradespersonId =
      repair.acceptedQuote.tradesperson?._id || repair.acceptedQuote.tradesperson;
    console.log('Starting chat for repair:', repair);
    console.log('Using tradespersonId:', tradespersonId);
    setStartingChatId(repair._id);
    try {
      const { data } = await axios.post(`/api/chats/create-chat`, {
        repairId: repair._id,
        tradespersonId
      }, {
        headers: {
          Authorization: localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).token : '',
        },
      });
      if (data.success) {
        navigate(`/chat/${data.chat._id}`);
      } else {
        toast.error(data.error || 'Could not start chat');
        console.error('Chat creation error:', data);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Could not start chat');
      console.error('Chat creation error:', error.response?.data || error);
    } finally {
      setStartingChatId(null);
    }
  };

  if (loading) {
    return (
      <LayoutNF title="My Repair Jobs - Smart Fix">
        <div className="my-repairs-container">
          <div className="text-center">
            <h2>Loading...</h2>
          </div>
        </div>
      </LayoutNF>
    );
  }

  return (
    <LayoutNF title="My Repair Jobs - Smart Fix">
      <div className="my-repairs-container">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="my-repairs-content">
              <h1>My Repair Jobs</h1>
              
              {repairs.length === 0 ? (
                <div className="no-repairs">
                  <h3>No repair jobs posted yet</h3>
                  <p>Start by posting your first repair job!</p>
                  <Link to="/dashboard/user/create-repair" className="btn btn-primary">
                    Post Repair Job
                  </Link>
                </div>
              ) : (
                <div className="repairs-list">
                  {repairs.map((repair) => (
                    <div key={repair._id} className="repair-item">
                      <div className="repair-header">
                        <h4>{repair.title}</h4>
                        <div className="repair-status">
                          <span className={`status-badge ${getStatusColor(repair.status)}`}>
                            {repair.status.replace('_', ' ')}
                          </span>
                          <span className={`urgency-badge ${getUrgencyColor(repair.urgency)}`}>
                            {repair.urgency}
                          </span>
                        </div>
                      </div>
                      
                      <div className="repair-details">
                        <p className="repair-description">{repair.description}</p>
                        
                        <div className="repair-meta">
                          <div className="meta-item">
                            <strong>Category:</strong> {repair.category}
                          </div>
                          <div className="meta-item">
                            <strong>Location:</strong> {repair.location}
                          </div>
                          <div className="meta-item">
                            <strong>Posted:</strong> {new Date(repair.createdAt).toLocaleDateString()}
                          </div>
                          {repair.budget && (repair.budget.min || repair.budget.max) && (
                            <div className="meta-item">
                              <strong>Budget:</strong> 
                              {repair.budget.min && repair.budget.max 
                                ? ` $${repair.budget.min} - $${repair.budget.max}`
                                : repair.budget.min 
                                  ? ` From $${repair.budget.min}`
                                  : ` Up to $${repair.budget.max}`
                              }
                            </div>
                          )}
                        </div>

                        {repair.acceptedQuote && (
                          <div className="accepted-quote">
                            <h5>Accepted Quote</h5>
                            <p><strong>Price:</strong> ${repair.acceptedQuote.price}</p>
                            <p><strong>Duration:</strong> {repair.acceptedQuote.estimatedDuration}</p>
                            <p><strong>Description:</strong> {repair.acceptedQuote.description}</p>
                          </div>
                        )}
                      </div>

                      <div className="repair-actions">
                        <Link 
                          to={`/repair/${repair._id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View Details
                        </Link>
                        {repair.acceptedQuote && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleStartChat(repair)}
                            disabled={startingChatId === repair._id}
                            style={{ minWidth: 120 }}
                          >
                            {startingChatId === repair._id ? 'Starting Chat...' : 'Chat with Tradesperson'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutNF>
  );
};

export default MyRepairs; 