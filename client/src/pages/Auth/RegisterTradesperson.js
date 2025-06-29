import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "./RegisterTradesperson.css";

const RegisterTradesperson = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [tradeType, setTradeType] = useState("");
  const [experience, setExperience] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [skills, setSkills] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      const res = await axios.post(
        `${process.env.REACT_APP_API || 'http://localhost:8080'}/api/users/register-tradesperson`,
        {
          firstname,
          lastname,
          email,
          password,
          phone,
          address,
          tradeType,
          experience: parseInt(experience),
          hourlyRate: parseFloat(hourlyRate),
          skills: skillsArray
        }
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate(location.state || "/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Register Tradesperson - Smart Fix">
      <div className="register-tradesperson-container">
        <div className="register-tradesperson-form">
          <h1>Register as Tradesperson</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="form-control"
                placeholder="Enter Your First Name"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="form-control"
                placeholder="Enter Your Last Name"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter Your Email"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Enter Your Password"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-control"
                placeholder="Enter Your Phone"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control"
                placeholder="Enter Your Address"
                required
              />
            </div>
            <div className="form-group">
              <select
                value={tradeType}
                onChange={(e) => setTradeType(e.target.value)}
                className="form-control"
                required
              >
                <option value="">Select Trade Type</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="carpentry">Carpentry</option>
                <option value="painting">Painting</option>
                <option value="hvac">HVAC</option>
                <option value="general">General</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="form-control"
                placeholder="Years of Experience"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="form-control"
                placeholder="Hourly Rate ($)"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="form-control"
                placeholder="Skills (comma-separated)"
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              REGISTER
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterTradesperson; 