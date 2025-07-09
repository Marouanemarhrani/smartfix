import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout/Layout';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/auth';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';

const ChatPage = () => {
  const { chatId } = useParams();
  const [auth] = useAuth();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

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

  return (
    <Layout title="Chat">
      <div className="container py-5" style={{ maxWidth: 700, margin: '0 auto' }}>
        {loading ? (
          <div className="loading">Loading chat...</div>
        ) : !chat ? (
          <p className="no-data">Chat not found or you do not have access.</p>
        ) : (
          <div className="card" style={{ minHeight: 500, display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow)', borderRadius: 'var(--radius)' }}>
            {/* Chat Header */}
            <div style={{ borderBottom: '1px solid #eee', padding: '1.2rem', background: 'var(--color-bg)', borderTopLeftRadius: 'var(--radius)', borderTopRightRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ background: 'var(--color-primary)', color: '#fff', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                <UserOutlined />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.1rem' }}>{chat.repair?.title || 'Untitled Repair'}</div>
                <div style={{ color: '#888', fontSize: '0.97rem' }}>
                  With: {auth?.user?._id === chat.client._id ? `${chat.tradesperson.firstname} ${chat.tradesperson.lastname}` : `${chat.client.firstname} ${chat.client.lastname}`}
                </div>
              </div>
            </div>
            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.2rem', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
              {chat.messages.length === 0 ? (
                <div className="no-data">No messages yet.</div>
              ) : (
                chat.messages.map((msg, idx) => {
                  const isMe = msg.sender === auth?.user?._id;
                  return (
                    <div key={idx} style={{
                      marginBottom: '1.2rem',
                      display: 'flex',
                      flexDirection: isMe ? 'row-reverse' : 'row',
                      alignItems: 'flex-end',
                      gap: 10
                    }}>
                      <div style={{ background: isMe ? 'var(--color-primary)' : 'var(--color-surface)', color: isMe ? '#fff' : 'var(--color-text)', borderRadius: 18, padding: '0.7rem 1.2rem', maxWidth: 340, fontSize: '1rem', boxShadow: 'var(--shadow)', wordBreak: 'break-word', position: 'relative' }}>
                        {msg.content}
                        <div style={{ fontSize: '0.8rem', color: isMe ? '#e0e7ef' : '#888', marginTop: 6, textAlign: isMe ? 'right' : 'left' }}>
                          {new Date(msg.timestamp).toLocaleString()}
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
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message..."
                style={{ flex: 1, border: '1px solid #d1d5db', borderRadius: 20, padding: '0.7rem 1.2rem', fontSize: '1rem', marginRight: 10, background: '#f8fafc' }}
                disabled={sending}
              />
              <button type="submit" className="btn" disabled={sending} style={{ minWidth: 100, fontWeight: 600 }}>
                {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ChatPage; 