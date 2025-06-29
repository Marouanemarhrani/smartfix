import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import TradespersonMenu from '../../components/Layout/TradespersonMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import './CreateQuote.css';

const CreateQuote = () => {
  const { repairId } = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [repair, setRepair] = useState(null);
  const [formData, setFormData] = useState({
    price: '',
    description: '',
    estimatedDuration: '',
    materials: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRepairDetails();
  }, [repairId]);

  const fetchRepairDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API}/api/repairs/get-repair/${repairId}`);
      setRepair(res.data.repair);
    } catch (error) {
      console.error('Error fetching repair details:', error);
      toast.error('Error loading repair details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Validation
    if (!formData.price || formData.price <= 0) {
      toast.error('Please enter a valid price');
      setSubmitting(false);
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      setSubmitting(false);
      return;
    }

    if (!formData.estimatedDuration.trim()) {
      toast.error('Please enter estimated duration');
      setSubmitting(false);
      return;
    }

    try {
      // Convert materials string to array of strings
      const materialsArray = formData.materials
        .split(',')
        .map(material => material.trim())
        .filter(material => material);
      
      const quoteData = {
        repairId,
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        estimatedDuration: formData.estimatedDuration.trim(),
        materials: materialsArray
      };

      console.log('Submitting quote data:', quoteData);
      console.log('Current auth token:', localStorage.getItem('auth'));
      
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/quotes/create-quote`,
        quoteData
      );

      console.log('Quote submission response:', res.data);

      if (res.data.success) {
        toast.success('Quote submitted successfully!');
        navigate('/dashboard/tradesperson/my-quotes');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      if (error.response?.status === 401) {
        toast.error('Authentication error. Please log in again.');
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.error || 'Invalid data provided');
      } else if (error.response?.status === 404) {
        toast.error('Repair job not found');
      } else {
        toast.error(error.response?.data?.error || error.response?.data?.message || 'Error submitting quote');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="create-quote-container">
        <TradespersonMenu />
        <div className="quote-content">
          <div className="loading">Loading repair details...</div>
        </div>
      </div>
    );
  }

  if (!repair) {
    return (
      <div className="create-quote-container">
        <TradespersonMenu />
        <div className="quote-content">
          <div className="error-message">
            <h3>Repair job not found</h3>
            <p>The repair job you're looking for doesn't exist or has been removed.</p>
            <button onClick={() => navigate('/')} className="back-btn">
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-quote-container">
      <TradespersonMenu />
      
      <div className="quote-content">
        <div className="quote-header">
          <h1>Submit Quote</h1>
          <p>Provide your quote for this repair job</p>
        </div>

        <div className="repair-details-card">
          <h3>Repair Job Details</h3>
          <div className="repair-info">
            <div className="info-row">
              <span className="info-label">Title:</span>
              <span className="info-value">{repair.title}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Description:</span>
              <span className="info-value">{repair.description}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Category:</span>
              <span className="info-value">{repair.category}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Location:</span>
              <span className="info-value">{repair.location}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Urgency:</span>
              <span className="info-value">{repair.urgency}</span>
            </div>
            {repair.budget && (
              <div className="info-row">
                <span className="info-label">Client Budget:</span>
                <span className="info-value">${repair.budget}</span>
              </div>
            )}
          </div>
        </div>

        <div className="quote-form-container">
          <form onSubmit={handleSubmit} className="quote-form">
            <div className="form-section">
              <h3>Quote Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price ($)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    placeholder="Enter your quote amount"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="estimatedDuration">Estimated Duration</label>
                  <input
                    type="text"
                    id="estimatedDuration"
                    name="estimatedDuration"
                    value={formData.estimatedDuration}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 2-3 hours, 1 day"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Work Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                  placeholder="Describe the work you will perform, your approach, and any specific details about the repair..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="materials">Materials (comma-separated)</label>
                <textarea
                  id="materials"
                  name="materials"
                  value={formData.materials}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g., PVC pipes, fittings, sealant, etc."
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => navigate('/')} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Quote'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuote; 