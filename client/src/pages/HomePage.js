import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Button, Modal, Form, Input, InputNumber, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './HomePage.css';

const { TextArea } = Input;

const HomePage = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteForm] = Form.useForm();

  const navigate = useNavigate();
  const [auth] = useAuth();

  // Fetch all repair jobs
  const getAllRepairs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API || 'http://localhost:8080'}/api/repairs/get-all-repairs`
      );
      setLoading(false);
      console.log('Repairs data:', data);
      setRepairs(data?.repairs);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error('Error getting repair jobs');
    }
  };

  // Handle quote submission
  const handleSubmitQuote = async (values) => {
    try {
      setSubmittingQuote(true);
      const { data } = await axios.post(`${process.env.REACT_APP_API || 'http://localhost:8080'}/api/quotes/create-quote`, {
        repairId: selectedRepair._id,
        ...values
      });

      if (data.success) {
        toast.success('Quote submitted successfully!');
        setQuoteModalVisible(false);
        quoteForm.resetFields();
        setSelectedRepair(null);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Error submitting quote');
    } finally {
      setSubmittingQuote(false);
    }
  };

  // Open quote modal
  const openQuoteModal = (repair) => {
    setSelectedRepair(repair);
    setQuoteModalVisible(true);
  };

  useEffect(() => {
    getAllRepairs();
  }, []);

  const isTradesperson = auth?.user?.role === 3;

  return (
    <Layout title={"Smart Fix - Home"}>
      <div className="homepage-container">
        <div className="main-content">
          <div className="row">
            {/* Repair Jobs Section */}
            <div className="col-12">
              <h1 className="text-center">Available Repair Jobs</h1>
              
              <div className="repairs-grid">
                {repairs?.map((repair) => (
                  <div key={repair._id} className="repair-card">
                    <div className="repair-image">
                      {repair.photoCount > 0 ? (
                        <img 
                          src={`${process.env.REACT_APP_API || 'http://localhost:8080'}/api/repairs/repair-photo/${repair._id}/0`}
                          alt={repair.title}
                          onError={(e) => {
                            console.error('Image failed to load for repair:', repair._id, 'URL:', e.target.src);
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully for repair:', repair._id);
                          }}
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                      <div className="no-image" style={{ display: 'none' }}>Image Failed to Load</div>
                    </div>
                    <div className="repair-content">
                      <h5>{repair.title}</h5>
                      <p className="repair-description">{repair.description.substring(0, 100)}...</p>
                      <div className="repair-meta">
                        <span className="category">{repair.category}</span>
                        <span className="location">{repair.location}</span>
                        <span className={`urgency urgency-${repair.urgency}`}>{repair.urgency}</span>
                      </div>
                      <div className="repair-footer">
                        <span className="client">Posted by: {repair.client?.firstname} {repair.client?.lastname}</span>
                        <div className="repair-actions">
                          <Link 
                            to={`/repair/${repair._id}`}
                            className="btn btn-primary btn-sm"
                          >
                            View Details
                          </Link>
                          {isTradesperson && repair.status === 'open' && (
                            <Button 
                              type="default"
                              icon={<PlusOutlined />}
                              size="small"
                              onClick={() => openQuoteModal(repair)}
                              className="quote-btn"
                            >
                              Submit Quote
                            </Button>
                          )}
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              console.log('Testing photo endpoint for repair:', repair._id);
                              console.log('Photo count:', repair.photoCount);
                              fetch(`${process.env.REACT_APP_API || 'http://localhost:8080'}/api/repairs/test-photos/${repair._id}`)
                                .then(res => res.json())
                                .then(data => console.log('Photo test result:', data))
                                .catch(err => console.error('Photo test error:', err));
                            }}
                          >
                            Test Photos
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {loading && (
                <div className="text-center">
                  <h2>Loading...</h2>
                </div>
              )}

              {repairs?.length === 0 && !loading && (
                <div className="text-center">
                  <h2>No repair jobs found</h2>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quote Submission Modal */}
        <Modal
          title={`Submit Quote for: ${selectedRepair?.title}`}
          open={quoteModalVisible}
          onCancel={() => {
            setQuoteModalVisible(false);
            setSelectedRepair(null);
            quoteForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={quoteForm}
            layout="vertical"
            onFinish={handleSubmitQuote}
          >
            <Form.Item
              name="price"
              label="Price ($)"
              rules={[{ required: true, message: 'Please enter the price' }]}
            >
              <InputNumber
                min={0}
                placeholder="Enter your quote price"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter a description' }]}
            >
              <TextArea
                rows={4}
                placeholder="Describe your approach to this repair job"
              />
            </Form.Item>

            <Form.Item
              name="estimatedDuration"
              label="Estimated Duration (hours)"
              rules={[{ required: true, message: 'Please enter estimated duration' }]}
            >
              <InputNumber
                min={1}
                placeholder="How long will this take?"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="materials"
              label="Materials Needed"
            >
              <Select
                mode="tags"
                placeholder="Add materials (optional)"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={submittingQuote}
                block
              >
                Submit Quote
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default HomePage;
