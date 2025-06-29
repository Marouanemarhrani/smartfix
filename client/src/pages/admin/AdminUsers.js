import React, { useState, useEffect } from 'react';
import LayoutNF from '../../components/Layout/LayoutNF';
import AdminMenu from '../../components/Layout/AdminMenu';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from 'moment';
import "./AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();

  // Get all users
  const getAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/users/all-users`);
      if (data?.success) {
        setUsers(data?.users);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Lifecycle method
  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <LayoutNF title={"All Users"}>
      <div className='adm container-fluid m-3 p-3'>
        <div className='adm1 row'>
          <div className='adm2 col-md-3'>
            <AdminMenu />
          </div>
          <div className='adm3 col-md-9'>
            <h1 className="text-center">All Users</h1>
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
                        <th scope="col">Role</th>
                        <th scope="col">Joined</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users?.map((u, i) => (
                        <tr key={u._id}>
                          <td>{i + 1}</td>
                          <td>{u.firstname} {u.lastname}</td>
                          <td>{u.email}</td>
                          <td>{u.phone}</td>
                          <td>
                            {u.role === 1 ? 'Admin' : 
                             u.role === 3 ? 'Tradesperson' : 'Client'}
                          </td>
                          <td>{moment(u.createdAt).format('YYYY-MM-DD')}</td>
                          <td>
                            <button className="btn btn-primary ms-2">
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
    </LayoutNF>
  );
};

export default AdminUsers; 