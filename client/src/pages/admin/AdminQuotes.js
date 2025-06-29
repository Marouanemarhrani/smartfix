import React, { useState, useEffect } from 'react';
import LayoutNF from '../../components/Layout/LayoutNF';
import AdminMenu from '../../components/Layout/AdminMenu';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from 'moment';
import "./AdminQuotes.css";

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();

  // Get all quotes
  const getAllQuotes = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/quotes/all-quotes`);
      if (data?.success) {
        setQuotes(data?.quotes);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Lifecycle method
  useEffect(() => {
    getAllQuotes();
  }, []);

  return (
    <LayoutNF title={"All Quotes"}>
      <div className='adm container-fluid m-3 p-3'>
        <div className='adm1 row'>
          <div className='adm2 col-md-3'>
            <AdminMenu />
          </div>
          <div className='adm3 col-md-9'>
            <h1 className="text-center">All Quotes</h1>
            <div className="d-flex">
              <div className="col-md-12">
                <div className="border shadow p-5">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Repair Title</th>
                        <th scope="col">Tradesperson</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Status</th>
                        <th scope="col">Created At</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotes?.map((q, i) => (
                        <tr key={q._id}>
                          <td>{i + 1}</td>
                          <td>{q.repair?.title}</td>
                          <td>{q.tradesperson?.firstname} {q.tradesperson?.lastname}</td>
                          <td>${q.amount}</td>
                          <td>{q.status}</td>
                          <td>{moment(q.createdAt).format('YYYY-MM-DD HH:mm')}</td>
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

export default AdminQuotes; 