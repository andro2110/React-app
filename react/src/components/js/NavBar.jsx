import React, { useState } from "react";
import logo from "../img/LogoBlack.svg";
import userIcon from "../img/usericon2.svg";
import { regularLinks, loggedInLinks } from "./common/navbarlinks";
import RenderLinks from "./common/RenderLinks";
import "../css/NavBar.css";

const NavBar = ({ heading, loggedIn }) => {
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
          {loggedIn ? (
            <RenderLinks links={loggedInLinks} />
          ) : (
            <RenderLinks links={regularLinks} />
          )}
        </div>
        <img src={userIcon} alt="userIcon" height="30" />
      </div>
    </nav>
  );
};

export default NavBar;
