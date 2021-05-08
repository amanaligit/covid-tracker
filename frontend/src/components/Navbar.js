import React from "react";
import { NavLink } from "react-router-dom";
import Logout from "./Logout";
import { AiOutlineLogin } from "react-icons/ai";
import { RiVirusFill } from "react-icons/ri";
import { ImDatabase } from "react-icons/im";
import { FaSignInAlt } from "react-icons/fa";

// The navbar functional component. The protected links the disabled if the user is not logged in
function Navbar({ signedIn, setSignedIn }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand " href="/">
        COVID-19 Tracker <RiVirusFill />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto  text-center">
          <li className="nav-item">
            <NavLink
              className={`nav-link ${signedIn ? "disabled" : null}`}
              exact
              to="/"
              activeClassName="active"
            >
              <AiOutlineLogin /> Login
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={`nav-link ${signedIn ? "disabled" : null}`}
              to="/register"
              exact
              activeClassName="active"
            >
              <FaSignInAlt /> Register
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={`nav-link ${signedIn ? null : "disabled"}`}
              to="/update-form"
              exact
              activeClassName="active"
            >
              <ImDatabase /> Update Covid-19 data
            </NavLink>
          </li>
        </ul>

        <span className="navbar-text float-right">
          {signedIn ? (
            <Logout setSignedIn={setSignedIn} />
          ) : (
            <>Not signed in.</>
          )}
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
