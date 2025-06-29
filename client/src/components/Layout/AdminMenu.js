import React from 'react';
import { NavLink } from 'react-router-dom';
import "./AdminMenu.css";
 
const AdminMenu = () => {
  return (
    <> 
      <div className='adminmenu text-center'>
        <div className="adminmenu1 list-group">
            <h4>Admin panel</h4>
                <NavLink 
                    to="/dashboard/admin/repairs" 
                    className="adminmenu4 list-group-item list-group-item-action"
                >
                    All Repairs
                </NavLink>
                <NavLink 
                    to="/dashboard/admin/quotes" 
                    className="adminmenu4 list-group-item list-group-item-action"
                >
                    All Quotes
                </NavLink>
                <NavLink 
                    to="/dashboard/admin/users" 
                    className="adminmenu4 list-group-item list-group-item-action"
                >
                    Users
                </NavLink>
                <NavLink 
                    to="/dashboard/admin/tradespeople" 
                    className="adminmenu4 list-group-item list-group-item-action"
                >
                    Tradespeople
                </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
