import React, { useState } from 'react';
import LayoutNF from '../../components/Layout/LayoutNF';
import UserMenu from '../../components/Layout/UserMenu';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './CreateRepair.css';

const CreateRepair = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !description || !category || !location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('location', location);
      formData.append('urgency', urgency);
      
      if (budgetMin) formData.append('budget[min]', budgetMin);
      if (budgetMax) formData.append('budget[max]', budgetMax);
      
      // Append photos
      photos.forEach((photo, index) => {
        formData.append('photos', photo);
      });

      const { data } = await axios.post(
        `${process.env.REACT_APP_API || 'http://localhost:8080'}/api/repairs/create-repair`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).token : '',
          },
        }
      );

      if (data.success) {
        toast.success('Repair job posted successfully!');
        navigate('/dashboard/user/my-repairs');
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.log(error);
      toast.error('Error posting repair job');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  return (
    <LayoutNF title="Create Repair Job - Smart Fix">
      <div className="create-repair-container">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="create-repair-form">
              <h1>Post a Repair Job</h1>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                    placeholder="Brief description of the repair needed"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control"
                    placeholder="Detailed description of the problem"
                    rows="4"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>Category *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="form-control"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="carpentry">Carpentry</option>
                      <option value="painting">Painting</option>
                      <option value="hvac">HVAC</option>
                      <option value="general">General</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group col-md-6">
                    <label>Urgency</label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="form-control"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="form-control"
                    placeholder="Your address or location"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label>Budget Min ($)</label>
                    <input
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      className="form-control"
                      placeholder="Minimum budget"
                      min="0"
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label>Budget Max ($)</label>
                    <input
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      className="form-control"
                      placeholder="Maximum budget"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Photos</label>
                  <input
                    type="file"
                    onChange={handlePhotoChange}
                    className="form-control"
                    multiple
                    accept="image/*"
                  />
                  <small className="form-text text-muted">
                    Upload photos of the problem (optional, max 5 photos)
                  </small>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Posting...' : 'Post Repair Job'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LayoutNF>
  );
};

export default CreateRepair; 