import React, { useEffect, useState, useRef } from 'react';
import UserMenu from '../components/Layout/UserMenu';
import TradespersonMenu from '../components/Layout/TradespersonMenu';
import AdminMenu from '../components/Layout/AdminMenu';
import Header from '../components/Layout/Header';
import '../pages/user/Dashboard.css';
import '../pages/tradesperson/TradespersonDashboard.css';
import '../pages/admin/AdminDashboard.css';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/auth';
import axios from 'axios';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';

const ChatPage = () => {
  const { chatId } = useParams();
  const [auth] = useAuth();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/chats/get-messages/${chatId}`, {
          headers: { Authorization: auth?.token }
        });
        if (data.success) {
          setChat(data.chat);
        }
      } catch (error) {
        setChat(null);
      } finally {
        setLoading(false);
      }
    };
    if (auth?.token && chatId) fetchChat();
  }, [auth, chatId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      const { data } = await axios.post(`/api/chats/send-message`, {
        chatId,
        content: message
      }, {
        headers: { Authorization: auth?.token }
      });
      if (data.success) {
        setChat(prev => ({ ...prev, messages: [...prev.messages, data.message] }));
        setMessage('');
      }
    } catch (error) {
      window.toast && window.toast.error && window.toast.error(error.response?.data?.error || 'Error sending message');
      // If you use react-hot-toast, import and use toast.error instead
      // toast.error(error.response?.data?.error || 'Error sending message');
    } finally {
      setSending(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('chatId', chatId);
      formData.append('attachment', file);
      formData.append('content', '');
      const { data } = await axios.post('/api/chats/send-message', formData, {
        headers: {
          Authorization: auth?.token,
        },
      });
      if (data.success) {
        setChat((prev) => ({ ...prev, messages: [...prev.messages, data.message] }));
      }
    } catch (error) {
      window.toast && window.toast.error && window.toast.error(error.response?.data?.error || 'Error sending image');
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Early return for loading or error
  if (loading) {
    if (auth?.user?.role === 3) {
      return (
        <>
          <Header />
          <div className="tradesperson-dashboard-container">
            <TradespersonMenu />
            <div className="dashboard-content">
              <div className="loading">Loading chat...</div>
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <Header />
        <div className={
          auth?.user?.role === 1 ? 'adm container-fluid m-3 p-3' :
          'divDashboard container-fluid m-3 p-3'
        }>
          <div className={
            auth?.user?.role === 1 ? 'adm1 row' :
            'divd2 row'
          }>
            <div className={
              auth?.user?.role === 1 ? 'adm2 col-md-3' :
              'divUserMenu col-md-3'
            }>
              {auth?.user?.role === 1 ? <AdminMenu /> : <UserMenu />}
            </div>
            <div className={
              auth?.user?.role === 1 ? 'adm3 col-md-9' :
              'divd4 col-md-9'
            }>
              <div className="loading">Loading chat...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!chat) {
    if (auth?.user?.role === 3) {
      return (
        <>
          <Header />
          <div className="tradesperson-dashboard-container">
            <TradespersonMenu />
            <div className="dashboard-content">
              <p className="no-data">Chat not found or you do not have access.</p>
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <Header />
        <div className={
          auth?.user?.role === 1 ? 'adm container-fluid m-3 p-3' :
          'divDashboard container-fluid m-3 p-3'
        }>
          <div className={
            auth?.user?.role === 1 ? 'adm1 row' :
            'divd2 row'
          }>
            <div className={
              auth?.user?.role === 1 ? 'adm2 col-md-3' :
              'divUserMenu col-md-3'
            }>
              {auth?.user?.role === 1 ? <AdminMenu /> : <UserMenu />}
            </div>
            <div className={
              auth?.user?.role === 1 ? 'adm3 col-md-9' :
              'divd4 col-md-9'
            }>
              <p className="no-data">Chat not found or you do not have access.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Main content
  if (auth?.user?.role === 3) {
    return (
      <>
        <Header />
        <div className="tradesperson-dashboard-container">
          <TradespersonMenu />
          <div className="dashboard-content">
            {/* Chat Card */}
            <div className="card" style={{ minHeight: 500, display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow)', borderRadius: 'var(--radius)' }}>
              {/* Chat Header */}
              <div style={{ borderBottom: '1px solid #eee', padding: '1.2rem', background: 'var(--color-bg)', borderTopLeftRadius: 'var(--radius)', borderTopRightRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ background: 'var(--color-primary)', color: '#fff', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  <UserOutlined />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>{chat.repair?.title || 'Untitled Repair'}</div>
                  <div style={{ color: '#888', fontSize: '0.97rem' }}>
                    With: {chat.client && chat.tradesperson && auth?.user?._id === chat.client._id ? `${chat.tradesperson.firstname} ${chat.tradesperson.lastname}` : chat.client ? `${chat.client.firstname} ${chat.client.lastname}` : ''}
                  </div>
                </div>
              </div>
              {/* Chat Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
                {!chat.messages || chat.messages.length === 0 ? (
                  <div className="no-data">No messages yet.</div>
                ) : (
                  chat.messages.map((msg, idx) => {
                    // Support both populated (object) and non-populated (string) sender
                    const senderId = typeof msg.sender === 'object' && msg.sender !== null ? msg.sender._id : msg.sender;
                    const isMe = senderId === auth?.user?._id;
                    return (
                      <div key={idx} style={{
                        marginBottom: '1.2rem',
                        display: 'flex',
                        flexDirection: isMe ? 'row-reverse' : 'row',
                        alignItems: 'flex-end',
                        gap: 10
                      }}>
                        <div style={{ background: isMe ? 'var(--color-primary)' : 'var(--color-surface)', color: isMe ? '#fff' : 'var(--color-text)', borderRadius: 18, padding: '0.7rem 1.2rem', maxWidth: 340, fontSize: '1rem', boxShadow: 'var(--shadow)', wordBreak: 'break-word', position: 'relative' }}>
                          {msg.messageType === 'image' && msg.attachments && msg.attachments.length > 0 ? (
                            <img
                              src={`/api/chats/attachment/${chat._id}/${idx}/0`}
                              alt="chat-img"
                              style={{ maxWidth: 220, maxHeight: 220, borderRadius: 10, marginBottom: 8 }}
                            />
                          ) : (
                            msg.content
                          )}
                          <div style={{ fontSize: '0.8rem', color: isMe ? '#e0e7ef' : '#888', marginTop: 6, textAlign: isMe ? 'right' : 'left' }}>
                            {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Chat Input */}
              <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #eee', padding: '1.2rem', background: 'var(--color-surface)', borderBottomLeftRadius: 'var(--radius)', borderBottomRightRadius: 'var(--radius)' }}>
                <button
                  type="button"
                  className="btn"
                  style={{ marginRight: 10, minWidth: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  disabled={imageUploading}
                  title="Send Image"
                >
                  <PlusOutlined style={{ fontSize: 22 }} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  disabled={imageUploading}
                />
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: 20, padding: '0.7rem 1.2rem', fontSize: '1rem', marginRight: 10, background: '#f8fafc' }}
                  disabled={sending || imageUploading}
                />
                <button type="submit" className="btn" disabled={sending || imageUploading} style={{ minWidth: 100, fontWeight: 600 }}>
                  {sending ? 'Sending...' : imageUploading ? 'Uploading...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={
        auth?.user?.role === 1 ? 'adm container-fluid m-3 p-3' :
        auth?.user?.role === 3 ? 'tradesperson-dashboard-container' :
        'divDashboard container-fluid m-3 p-3'
      }>
        <div className={
          auth?.user?.role === 1 ? 'adm1 row' :
          auth?.user?.role === 3 ? '' :
          'divd2 row'
        }>
          <div className={
            auth?.user?.role === 1 ? 'adm2 col-md-3' :
            auth?.user?.role === 3 ? '' :
            'divUserMenu col-md-3'
          }>
            {auth?.user?.role === 1 ? <AdminMenu /> : auth?.user?.role === 3 ? <TradespersonMenu /> : <UserMenu />}
          </div>
          <div className={
            auth?.user?.role === 1 ? 'adm3 col-md-9' :
            auth?.user?.role === 3 ? 'dashboard-content' :
            'divd4 col-md-9'
          }>
            {/* Chat Card */}
            <div className="card" style={{ minHeight: 500, display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow)', borderRadius: 'var(--radius)' }}>
              {/* Chat Header */}
              <div style={{ borderBottom: '1px solid #eee', padding: '1.2rem', background: 'var(--color-bg)', borderTopLeftRadius: 'var(--radius)', borderTopRightRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ background: 'var(--color-primary)', color: '#fff', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  <UserOutlined />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>{chat.repair?.title || 'Untitled Repair'}</div>
                  <div style={{ color: '#888', fontSize: '0.97rem' }}>
                    With: {chat.client && chat.tradesperson && auth?.user?._id === chat.client._id ? `${chat.tradesperson.firstname} ${chat.tradesperson.lastname}` : chat.client ? `${chat.client.firstname} ${chat.client.lastname}` : ''}
                  </div>
                </div>
              </div>
              {/* Chat Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
                {!chat.messages || chat.messages.length === 0 ? (
                  <div className="no-data">No messages yet.</div>
                ) : (
                  chat.messages.map((msg, idx) => {
                    // Support both populated (object) and non-populated (string) sender
                    const senderId = typeof msg.sender === 'object' && msg.sender !== null ? msg.sender._id : msg.sender;
                    const isMe = senderId === auth?.user?._id;
                    return (
                      <div key={idx} style={{
                        marginBottom: '1.2rem',
                        display: 'flex',
                        flexDirection: isMe ? 'row-reverse' : 'row',
                        alignItems: 'flex-end',
                        gap: 10
                      }}>
                        <div style={{ background: isMe ? 'var(--color-primary)' : 'var(--color-surface)', color: isMe ? '#fff' : 'var(--color-text)', borderRadius: 18, padding: '0.7rem 1.2rem', maxWidth: 340, fontSize: '1rem', boxShadow: 'var(--shadow)', wordBreak: 'break-word', position: 'relative' }}>
                          {msg.messageType === 'image' && msg.attachments && msg.attachments.length > 0 ? (
                            <img
                              src={`/api/chats/attachment/${chat._id}/${idx}/0`}
                              alt="chat-img"
                              style={{ maxWidth: 220, maxHeight: 220, borderRadius: 10, marginBottom: 8 }}
                            />
                          ) : (
                            msg.content
                          )}
                          <div style={{ fontSize: '0.8rem', color: isMe ? '#e0e7ef' : '#888', marginTop: 6, textAlign: isMe ? 'right' : 'left' }}>
                            {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Chat Input */}
              <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid #eee', padding: '1.2rem', background: 'var(--color-surface)', borderBottomLeftRadius: 'var(--radius)', borderBottomRightRadius: 'var(--radius)' }}>
                <button
                  type="button"
                  className="btn"
                  style={{ marginRight: 10, minWidth: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  disabled={imageUploading}
                  title="Send Image"
                >
                  <PlusOutlined style={{ fontSize: 22 }} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  disabled={imageUploading}
                />
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: 20, padding: '0.7rem 1.2rem', fontSize: '1rem', marginRight: 10, background: '#f8fafc' }}
                  disabled={sending || imageUploading}
                />
                <button type="submit" className="btn" disabled={sending || imageUploading} style={{ minWidth: 100, fontWeight: 600 }}>
                  {sending ? 'Sending...' : imageUploading ? 'Uploading...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage; 