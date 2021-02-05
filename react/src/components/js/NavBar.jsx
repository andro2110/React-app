import React from "react";
import logo from "../img/LogoBlack.svg";
import userIcon from "../img/usericon2.svg";
import "../css/NavBar.css";

// class NavBar extends Component {
//   state = {
//     links: ["Domov", "Blog", "Naroči", "Kdo sem?"],
//     pages: ["/", "/blog", "/narocila", "/kdosem"],
//   };
//   render() {
//     return (
// <nav>
//   <div className="logotip">
//     <img src={logo} className="svg logo" alt="logo" />
//     <p>MT Custom Sneakers</p>
//   </div>

//   <div className="logoList">
//     <ul>
//       {/* {this.state.links.map((link) => (
//         <li href={this.state.pages}>{link}</li>
//       ))} */}

//       <li>
//         <a href="/">Domov</a>
//       </li>
//       <li>
//         <a href="/blog">Blog</a>
//       </li>
//       <li>
//         <a href="/narocila">Narocila</a>
//       </li>

//       <li>
//         <a href="#kdosem">Kdo sem?</a>
//       </li>
//       <li>
//         <a href="/signUp">Sign Up</a>
//       </li>
//       <li>
//         <a href="/logout">logout</a>
//       </li>
//       <li>
//         <a href="/login">login</a>
//       </li>
//     </ul>

//     <img src={userIcon} alt="userIcon" />
//   </div>
// </nav>
//     );
//   }
// }

const NavBar = ({ heading }) => {
  return (
    <nav>
      <div className="logotip">
        <img src={logo} className="svg logo" alt="logo" />
        <p>{heading}</p>
      </div>

      <div className="logoList">
        <ul>
          {/* {this.state.links.map((link) => (
          <li href={this.state.pages}>{link}</li>
        ))} */}

          <li>
            <a href="/">Domov</a>
          </li>
          <li>
            <a href="/blog">Blog</a>
          </li>
          <li>
            <a href="/narocila">Narocila</a>
          </li>

          <li>
            <a href="#kdosem">Kdo sem?</a>
          </li>
          <li>
            <a href="/signUp">Sign Up</a>
          </li>
          <li>
            <a href="/logout">logout</a>
          </li>
          <li>
            <a href="/login">login</a>
          </li>
        </ul>

        <img src={userIcon} alt="userIcon" />
      </div>
    </nav>
  );
};

export default NavBar;
