import React, { useEffect, useState } from "react";
import logo from "../img/LogoBlack.svg";
import userIcon from "../img/usericon2.svg";
import {
  loggedOutLinks,
  adminLinks,
  loggedInLinks,
} from "./helpers/navbarlinks";
import RenderLinks from "./common/RenderLinks";
import axios from "axios";
import { redirectU } from "./helpers/redirectUser";
import "../css/NavBar.css";

const NavBar = ({ heading }) => {
  const [status, setStatus] = useState("");
  const [navLinks, setNavLinks] = useState([loggedOutLinks]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_ADDRESS}/checkAdmin`)
      .then((res) => {
        if (res.data.status) {
          setStatus(res.data.status.status);
        }
      });

    switch (status) {
      case "admin":
        setNavLinks(adminLinks);
        break;

      case "upor":
        setNavLinks(loggedInLinks);
        break;

      default:
        setNavLinks(loggedOutLinks);
        break;
    }
  });

  return (
    <nav className="navbar fixed-top navbar-expand-lg">
      <div className="container-fluid">
        <a href="/" className="navbar-brand">
          <img src={logo} className="svg logo" alt="logo" />
        </a>
        <h1 className="naslov">{heading}</h1>
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
          <RenderLinks links={navLinks} />
        </div>
        <img
          src={userIcon}
          alt="userIcon"
          height="30"
          onClick={redirectU}
          className="pIcon"
        />
      </div>
    </nav>
  );
};

export default NavBar;
