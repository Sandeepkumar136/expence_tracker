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
      <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        {/* Logo */}
        <div className="logo-contain">
          <img src={pictures.navlogo} alt="logo" className="nav-logo" />
          {isOpen && <span className="nt-nav-logo">SancoXp.in</span>}
        </div>

        {/* Navigation */}
        <ul className="nav-list">
          <li onClick={handleCollapse} className="nav-item tcm">
            <i className={`bx ${isOpen ? "bx-x" : "bx-menu"}`}></i>
          </li>
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
                isActive ? "m-nav-item active" : "nav-item"
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
