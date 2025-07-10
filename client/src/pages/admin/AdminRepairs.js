import React, { useState, useEffect } from 'react';
import LayoutNF from '../../components/Layout/LayoutNF';
import AdminMenu from '../../components/Layout/AdminMenu';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from 'moment';
import { Select, Modal, Descriptions } from 'antd';
import "./AdminRepairs.css";

const AdminRepairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Get all repairs
  const getAllRepairs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/repairs/all-repairs`);
      if (data?.success) {
        setRepairs(data?.repairs);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Lifecycle method
  useEffect(() => {
    getAllRepairs();
  }, []);

  // Handler pour ouvrir la modale
  const handleViewDetails = (repair) => {
    setSelectedRepair(repair);
    setIsModalVisible(true);
  };
  // Handler pour fermer la modale
  const handleCloseModal = () => {
    setSelectedRepair(null);
    setIsModalVisible(false);
  };

  return (
    <LayoutNF title={"All Repairs"}>
      <div className='adm container-fluid m-3 p-3'>
        <div className='adm1 row'>
          <div className='adm2 col-md-3'>
            <AdminMenu />
          </div>
          <div className='adm3 col-md-9'>
            <h1 className="text-center">All Repairs</h1>
            <div className="d-flex">
              <div className="col-md-12">
                <div className="border shadow p-5">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">Client</th>
                        <th scope="col">Status</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repairs?.map((r, i) => (
                        <tr key={r._id}>
                          <td>{i + 1}</td>
                          <td>{r.title}</td>
                          <td>{r.client?.firstname} {r.client?.lastname}</td>
                          <td>{r.status}</td>
                          <td>{moment(r.createdAt).format('YYYY-MM-DD HH:mm')}</td>
                          <td>
                            <button className="btn btn-primary ms-2" onClick={() => handleViewDetails(r)}>
                              View Details
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

      {/* Modal de détail repair */}
      <Modal
        title={selectedRepair ? `Repair Details: ${selectedRepair.title}` : ''}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
      >
        {selectedRepair && (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Title">{selectedRepair.title}</Descriptions.Item>
            <Descriptions.Item label="Client">{selectedRepair.client?.firstname} {selectedRepair.client?.lastname}</Descriptions.Item>
            <Descriptions.Item label="Status">{selectedRepair.status}</Descriptions.Item>
            <Descriptions.Item label="Category">{selectedRepair.category}</Descriptions.Item>
            <Descriptions.Item label="Location">{selectedRepair.location}</Descriptions.Item>
            <Descriptions.Item label="Urgency">{selectedRepair.urgency}</Descriptions.Item>
            <Descriptions.Item label="Budget">{selectedRepair.budgetMin} - {selectedRepair.budgetMax} €</Descriptions.Item>
            <Descriptions.Item label="Description">{selectedRepair.description}</Descriptions.Item>
            <Descriptions.Item label="Created At">{moment(selectedRepair.createdAt).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </LayoutNF>
  );
};

export default AdminRepairs; 