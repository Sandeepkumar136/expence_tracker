import React, { useState } from "react";
import pictures from "../imports/pictureimp";
import { NavLink } from "react-router-dom";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCollapse = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className='navigation'>
        <div className="nav-up-contain">
          <div className="nav-logo-contain">
          <i className="nav-toggle bx bx-menu"></i>
          <img src={pictures.navlogo} alt="Logo" className="nav-logo" />
          <span className="nav-logo-title">SNE Exp</span>
          </div>
          <i className="nav-user-logo bx bx-user"></i>
        </div>
        <ul className="nav-list">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <i className="bx bx-wallet"></i>
              {isOpen && <span className="ni-t">Accounts</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <i className="bx bx-swap-vertical"></i>
              {isOpen && <span className="ni-t">Transfer</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <i className="bx bx-history"></i>
              {isOpen && <span className="ni-t">History</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <i className="bx bx-user"></i>
              {isOpen && <span className="ni-t">User</span>}
            </NavLink>
          </li>
        </ul>
        
      </div>
      <div className="m-navbar">
        {/* Navigation */}
        <ul className="m-nav-list">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "m-nav-item active" : "m-nav-item"
              }
            >
              <i className="bx bx-wallet"></i>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                isActive ? "m-nav-item active" : "m-nav-item"
              }
            >
              <i className="bx bx-swap-vertical"></i>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive ? "m-nav-item active" : "m-nav-item"
              }
            >
              <i className="bx bx-history"></i>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive ? "m-nav-item active" : "m-nav-item"
              }
            >
              <i className="bx bx-user"></i>
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
