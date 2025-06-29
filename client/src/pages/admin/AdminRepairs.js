import React, { useState, useEffect } from 'react';
import LayoutNF from '../../components/Layout/LayoutNF';
import AdminMenu from '../../components/Layout/AdminMenu';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from 'moment';
import { Select } from 'antd';
import "./AdminRepairs.css";

const AdminRepairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();

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
                            <button className="btn btn-primary ms-2">
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
    </LayoutNF>
  );
};

export default AdminRepairs; 