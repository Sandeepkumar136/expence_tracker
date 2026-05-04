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
      <div className="navigation">
        <div className="nav-up-contain">
          <div className="nav-logo-contain">
            <i
              onClick={handleCollapse}
              className={`nav-toggle bx ${isOpen ? "bx-x" : "bx-menu"}`}
            ></i>
            <img src={pictures.navlogo} alt="Logo" className="nav-logo" />
            <span className="nav-logo-title">Railways.com</span>
          </div>
          <NavLink
            to="/user"
            className={({ isActive }) =>
              isActive
                ? "bx bx-user nav-user-logo active"
                : "bx bx-user nav-user-logo"
            }
          />
        </div>
        <div className={`sidebar ${isOpen ? "expend" : "collapsed"}`}>
          <ul className="nav-list">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  [
                    "nav-item",
                    isActive ? "active" : "",
                    isOpen ? "expanded" : "collapsed",
                  ].join(" ")
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
                  [
                    "nav-item",
                    isActive ? "active" : "",
                    isOpen ? "expanded" : "collapsed",
                  ].join(" ")
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
                  [
                    "nav-item",
                    isActive ? "active" : "",
                    isOpen ? "expanded" : "collapsed",
                  ].join(" ")
                }
              >
                <i className="bx bx-history"></i>
                {isOpen && <span className="ni-t">History</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/analyze"
                className={({ isActive }) =>
                  [
                    "nav-item",
                    isActive ? "active" : "",
                    isOpen ? "expanded" : "collapsed",
                  ].join(" ")
                }
              >
                <i className="bx bx-analyze" />
                {isOpen && <span className="ni-t">Analyze</span>}
              </NavLink>
            </li>
          </ul>
        </div>
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
              to="/analyze"
              className={({ isActive }) =>
                isActive ? "m-nav-item active" : "m-nav-item"
              }
            >
              <i className="bx bx-analyze" />
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
