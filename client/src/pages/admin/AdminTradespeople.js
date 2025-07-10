import React, { useState, useEffect } from 'react';
import LayoutNF from '../../components/Layout/LayoutNF';
import AdminMenu from '../../components/Layout/AdminMenu';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from 'moment';
import "./AdminTradespeople.css";
import { Modal, Descriptions } from 'antd';

const AdminTradespeople = () => {
  const [tradespeople, setTradespeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();
  const [selectedTradesperson, setSelectedTradesperson] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Get all tradespeople
  const getAllTradespeople = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/users/tradespeople`);
      if (data?.success) {
        setTradespeople(data?.tradespeople);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Lifecycle method
  useEffect(() => {
    getAllTradespeople();
  }, []);

  // Handler pour ouvrir la modale
  const handleViewProfile = (tradesperson) => {
    setSelectedTradesperson(tradesperson);
    setIsModalVisible(true);
  };
  // Handler pour fermer la modale
  const handleCloseModal = () => {
    setSelectedTradesperson(null);
    setIsModalVisible(false);
  };

  return (
    <LayoutNF title={"All Tradespeople"}>
      <div className='adm container-fluid m-3 p-3'>
        <div className='adm1 row'>
          <div className='adm2 col-md-3'>
            <AdminMenu />
          </div>
          <div className='adm3 col-md-9'>
            <h1 className="text-center">All Tradespeople</h1>
            <div className="d-flex">
              <div className="col-md-12">
                <div className="border shadow p-5">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Specialization</th>
                        <th scope="col">Experience</th>
                        <th scope="col">Joined</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tradespeople?.map((t, i) => (
                        <tr key={t._id}>
                          <td>{i + 1}</td>
                          <td>{t.firstname} {t.lastname}</td>
                          <td>{t.email}</td>
                          <td>{t.phone}</td>
                          <td>{t.specialization}</td>
                          <td>{t.experience} years</td>
                          <td>{moment(t.createdAt).format('YYYY-MM-DD')}</td>
                          <td>
                            <button className="btn btn-primary ms-2" onClick={() => handleViewProfile(t)}>
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de détail tradesperson */}
      <Modal
        title={selectedTradesperson ? `Tradesperson Profile: ${selectedTradesperson.firstname} ${selectedTradesperson.lastname}` : ''}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={500}
      >
        {selectedTradesperson && (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="First Name">{selectedTradesperson.firstname}</Descriptions.Item>
            <Descriptions.Item label="Last Name">{selectedTradesperson.lastname}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedTradesperson.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedTradesperson.phone}</Descriptions.Item>
            <Descriptions.Item label="Specialization">{selectedTradesperson.specialization}</Descriptions.Item>
            <Descriptions.Item label="Experience">{selectedTradesperson.experience} years</Descriptions.Item>
            <Descriptions.Item label="Joined">
              {moment(selectedTradesperson.createdAt).format('YYYY-MM-DD')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </LayoutNF>
  );
};

export default AdminTradespeople; 