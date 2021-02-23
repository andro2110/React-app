import React from "react";
import logo from "../img/LogoBlack.svg";
import userIcon from "../img/usericon2.svg";
import "../css/NavBar.css";

const NavBar = ({ heading, links }) => {
  return (
    <nav className="navbar navbar-light bg-light fixed-top navbar-expand-lg">
      <div className="container-fluid">
        <a href="/" className="navbar-brand">
          <img src={logo} className="svg logo" alt="logo" />
          {heading}
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#toggleNavbar"
          aria-controls="toggleNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse d-flex flex-row-reverse"
          id="toggleNavbar"
        >
          <ul className="navbar-nav ml-auto mb-2 mb-lg-0">
            {links.map((l, i) => {
              return (
                <li key={i} className="nav-item">
                  <a href={l.link} className="nav-link">
                    {l.linkName}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <img src={userIcon} alt="userIcon" height="30" />
      </div>
    </nav>
  );
};

export default NavBar;
