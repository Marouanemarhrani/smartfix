import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/auth';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment';
import { Button, Card, Modal, Form, Input, InputNumber, Select, Upload, message } from 'antd';
import { PlusOutlined, MessageOutlined, DollarOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import './RepairDetails.css';

const { TextArea } = Input;
const { Option } = Select;

const RepairDetails = () => {
  const [repair, setRepair] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [quoteForm] = Form.useForm();
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [acceptingQuote, setAcceptingQuote] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();

  // Fetch repair details
  const fetchRepairDetails = async () => {
    try {
      setLoading(true);
      console.log('Fetching repair details for ID:', id);
      const apiUrl = process.env.REACT_APP_API || 'http://localhost:8080';
      console.log('API URL:', `${apiUrl}/api/repairs/get-repair/${id}`);
      const { data } = await axios.get(`${apiUrl}/api/repairs/get-repair/${id}`);
      console.log('Repair details response:', data);
      if (data.success) {
        setRepair(data.repair);
      }
    } catch (error) {
      console.error('Error fetching repair details:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Error fetching repair details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch quotes for this repair
  const fetchQuotes = async () => {
    try {
      console.log('Fetching quotes for repair ID:', id);
      const apiUrl = process.env.REACT_APP_API || 'http://localhost:8080';
      console.log('API URL:', `${apiUrl}/api/quotes/get-quotes/${id}`);
      const { data } = await axios.get(`${apiUrl}/api/quotes/get-quotes/${id}`);
      console.log('Quotes response:', data);
      if (data.success) {
        setQuotes(data.quotes);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Error fetching quotes');
    }
  };

  // Submit quote
  const handleSubmitQuote = async (values) => {
    try {
      setSubmittingQuote(true);
      const apiUrl = process.env.REACT_APP_API || 'http://localhost:8080';
      const { data } = await axios.post(`${apiUrl}/api/quotes/create-quote`, {
        repairId: id,
        ...values
      });

      if (data.success) {
        toast.success('Quote submitted successfully!');
        setQuoteModalVisible(false);
        quoteForm.resetFields();
        fetchQuotes(); // Refresh quotes
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Error submitting quote');
    } finally {
      setSubmittingQuote(false);
    }
  };

  // Accept quote
  const handleAcceptQuote = async (quoteId) => {
    try {
      setAcceptingQuote(quoteId);
      const apiUrl = process.env.REACT_APP_API || 'http://localhost:8080';
      const { data } = await axios.put(`${apiUrl}/api/quotes/accept-quote/${quoteId}`, {});

      if (data.success) {
        toast.success('Quote accepted! Chat has been created.');
        navigate(`/chat/${data.chatId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Error accepting quote');
    } finally {
      setAcceptingQuote(null);
    }
  };

  // Start chat with tradesperson
  const handleStartChat = async (tradespersonId) => {
    try {
      const apiUrl = process.env.REACT_APP_API || 'http://localhost:8080';
      const { data } = await axios.post(`${apiUrl}/api/chats/create-chat`, {
        repairId: id,
        tradespersonId
      });

      if (data.success) {
        navigate(`/chat/${data.chat._id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error starting chat');
    }
  };

  useEffect(() => {
    fetchRepairDetails();
    fetchQuotes();
  }, [id]);

  if (loading) {
    return (
      <Layout title="Repair Details">
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!repair) {
    return (
      <Layout title="Repair Not Found">
        <div className="container py-5">
          <div className="text-center">
            <h2>Repair job not found</h2>
            <Button type="primary" onClick={() => navigate('/')}>
              Go Back Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isClient = auth?.user?.role === 0;
  const isTradesperson = auth?.user?.role === 3;
  const isOwner = repair.client._id === auth?.user?._id;
  const hasSubmittedQuote = quotes.some(quote => quote.tradesperson._id === auth?.user?._id);

  return (
    <Layout title={`Repair Details - ${repair.title}`}>
      <div className="container py-5">
        <div className="row">
          {/* Repair Details */}
          <div className="col-lg-8">
            <Card className="repair-details-card">
              <div className="repair-header">
                <h1 className="repair-title">{repair.title}</h1>
                <div className="repair-meta">
                  <span className={`status-badge status-${repair.status}`}>
                    {repair.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="posted-date">
                    Posted {moment(repair.createdAt).fromNow()}
                  </span>
                </div>
              </div>

              <div className="repair-info">
                <div className="info-section">
                  <h3>Description</h3>
                  <p>{repair.description}</p>
                </div>

                <div className="info-section">
                  <h3>Details</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <strong>Category:</strong> {repair.category}
                    </div>
                    <div className="detail-item">
                      <strong>Location:</strong> {repair.location}
                    </div>
                    <div className="detail-item">
                      <strong>Urgency:</strong> {repair.urgency}
                    </div>
                    {repair.budget && (
                      <div className="detail-item">
                        <strong>Budget:</strong> ${repair.budget}
                      </div>
                    )}
                  </div>
                </div>

                {repair.photos && repair.photos.length > 0 && (
                  <div className="info-section">
                    <h3>Photos</h3>
                    <div className="photos-grid">
                      {repair.photos.map((photo, index) => (
                        <div key={index} className="photo-item">
                          <img 
                            src={`/api/repairs/repair-photo/${repair._id}/${index}`}
                            alt={`Repair photo ${index + 1}`}
                            className="repair-photo"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="info-section">
                  <h3>Client Information</h3>
                  <div className="client-info">
                    <p><strong>Name:</strong> {repair.client.firstname} {repair.client.lastname}</p>
                    <p><strong>Email:</strong> {repair.client.email}</p>
                    <p><strong>Phone:</strong> {repair.client.phone}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Action Buttons */}
            <Card className="action-card">
              <h3>Actions</h3>
              
              {isTradesperson && !isOwner && !hasSubmittedQuote && repair.status === 'open' && (
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  size="large"
                  block
                  onClick={() => setQuoteModalVisible(true)}
                  className="action-button"
                >
                  Submit Quote
                </Button>
              )}

              {isTradesperson && !isOwner && hasSubmittedQuote && (
                <Button 
                  type="default" 
                  icon={<MessageOutlined />}
                  size="large"
                  block
                  onClick={() => handleStartChat(repair.client._id)}
                  className="action-button"
                >
                  Message Client
                </Button>
              )}

              {isClient && isOwner && repair.status === 'open' && (
                <Button 
                  type="primary" 
                  icon={<MessageOutlined />}
                  size="large"
                  block
                  onClick={() => navigate('/dashboard/user/my-repairs')}
                  className="action-button"
                >
                  View My Repairs
                </Button>
              )}
            </Card>

            {/* Quotes Section */}
            <Card className="quotes-card">
              <h3>Quotes ({quotes.length})</h3>
              
              {quotes.length === 0 ? (
                <p className="no-quotes">No quotes submitted yet.</p>
              ) : (
                <div className="quotes-list">
                  {quotes.map((quote) => (
                    <div key={quote._id} className="quote-item">
                      <div className="quote-header">
                        <div className="tradesperson-info">
                          <UserOutlined className="user-icon" />
                          <span>{quote.tradesperson.firstname} {quote.tradesperson.lastname}</span>
                        </div>
                        <div className="quote-price">
                          <DollarOutlined /> ${quote.price}
                        </div>
                      </div>
                      
                      <div className="quote-details">
                        <p><strong>Description:</strong> {quote.description}</p>
                        <p>
                          <ClockCircleOutlined /> {quote.estimatedDuration} hours
                        </p>
                        {quote.materials && quote.materials.length > 0 && (
                          <p><strong>Materials:</strong> {quote.materials.join(', ')}</p>
                        )}
                      </div>

                      <div className="quote-actions">
                        {isClient && isOwner && repair.status === 'open' && (
                          <Button 
                            type="primary"
                            onClick={() => handleAcceptQuote(quote._id)}
                            loading={acceptingQuote === quote._id}
                            block
                          >
                            Accept Quote
                          </Button>
                        )}
                        
                        {isTradesperson && quote.tradesperson._id === auth?.user?._id && (
                          <Button 
                            type="default"
                            onClick={() => handleStartChat(repair.client._id)}
                            block
                          >
                            Message Client
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Quote Submission Modal */}
        <Modal
          title="Submit Quote"
          open={quoteModalVisible}
          onCancel={() => setQuoteModalVisible(false)}
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

export default RepairDetails; 