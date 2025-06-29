import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import "./TradespersonMenu.css";

const TradespersonMenu = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <div className="tradesperson-menu">
      <div className="tradesperson-menu-header">
        <h3>Tradesperson Panel</h3>
        <p>Welcome, {auth?.user?.firstname} {auth?.user?.lastname}</p>
      </div>
      
      <div className="tradesperson-menu-links">
        <NavLink to="/dashboard/tradesperson" className="tradesperson-menu-link">
          <i className="fas fa-tachometer-alt"></i>
          Dashboard
        </NavLink>
        
        <NavLink to="/dashboard/tradesperson/profile" className="tradesperson-menu-link">
          <i className="fas fa-user"></i>
          My Profile
        </NavLink>
        
        <NavLink to="/dashboard/tradesperson/my-quotes" className="tradesperson-menu-link">
          <i className="fas fa-file-invoice-dollar"></i>
          My Quotes
        </NavLink>
        
        <NavLink to="/chats" className="tradesperson-menu-link">
          <i className="fas fa-comments"></i>
          My Chats
        </NavLink>
        
        <NavLink to="/" className="tradesperson-menu-link">
          <i className="fas fa-home"></i>
          Browse Jobs
        </NavLink>
      </div>
      
      <div className="tradesperson-menu-footer">
        <button onClick={handleLogout} className="tradesperson-logout-btn">
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default TradespersonMenu; 