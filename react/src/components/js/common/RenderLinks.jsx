import React from "react";

const RenderLinks = ({ links }) => {
  return (
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
  );
};

export default RenderLinks;
