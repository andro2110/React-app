import React, { Component } from "react";
import Navbar from "./js/NavBar";
import Gallery from "./js/Gallery";
import KdoSem from "./js/KdoSem";
import Footer from "./js/Footer";
import { regularLinks } from "./js/common/navbarlinks";
import axios from "axios";

class Neki extends Component {
  state = {};

  componentDidMount() {
    const token = localStorage.getItem("token");
    axios
      .post("http://localhost:4000/adminNarocila", { token })
      .then((response) => {
        // if (!response.data.admin) window.location = "/";
        // console.log(response.data);
      });
    // if (window.location.pathname === "/adminNarocila") window.location = "/";
  }

  render() {
    return (
      <React.Fragment>
        <Navbar heading="MT Custom Sneakers" links={regularLinks} />
        <Gallery />
        <KdoSem />
        <Footer />
      </React.Fragment>
    );
  }
}

export default Neki;
