import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/auth';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyChats = () => {
  const [auth] = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API || 'http://localhost:8080';
        const { data } = await axios.get(`${apiUrl}/api/chats/get-user-chats`, {
          headers: { Authorization: auth?.token }
        });
        if (data.success) {
          setChats(data.chats);
        }
      } catch (error) {
        setChats([]);
      } finally {
        setLoading(false);
      }
    };
    if (auth?.token) fetchChats();
  }, [auth]);

  return (
    <Layout title="My Chats">
      <div className="container py-5">
        <h1>My Chats</h1>
        {loading ? (
          <div className="loading">Loading chats...</div>
        ) : chats.length === 0 ? (
          <p className="no-data">You have no chats yet.</p>
        ) : (
          <div className="card" style={{ maxWidth: 700, margin: '0 auto' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {chats.map(chat => {
                const isClient = chat.client._id === auth?.user?._id;
                const otherUser = isClient ? chat.tradesperson : chat.client;
                return (
                  <li key={chat._id} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                    <Link to={`/chat/${chat._id}`} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{otherUser.firstname} {otherUser.lastname}</div>
                        <div style={{ color: 'var(--color-text)', fontSize: '0.95rem' }}>{chat.repair?.title || 'Untitled Repair'}</div>
                      </div>
                      <span style={{ color: '#888', fontSize: '0.85rem' }}>{new Date(chat.updatedAt).toLocaleDateString()}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyChats; 