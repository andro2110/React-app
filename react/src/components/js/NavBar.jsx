import React from "react";
import logo from "../img/LogoBlack.svg";
import userIcon from "../img/usericon2.svg";
import "../css/NavBar.css";

const NavBar = ({ heading, links }) => {
  return (
    <nav>
      <div className="logotip">
        <img src={logo} className="svg logo" alt="logo" />
        <p>{heading}</p>
      </div>

      <div className="logoList">
        <ul>
          {links.map((l, i) => {
            return (
              <li key={i}>
                <a href={l.link}>{l.linkName}</a>
              </li>
            );
          })}
        </ul>
        <img src={userIcon} alt="userIcon" />
      </div>
    </nav>
  );
};

export default NavBar;
