import React, { Component } from "react";
import Navbar from "./js/NavBar";
import Gallery from "./js/Gallery";
import KdoSem from "./js/KdoSem";
import Footer from "./js/Footer";
import axios from "axios";

class Neki extends Component {
  state = {
    t: false,
  };

  componentDidMount() {
    const token = localStorage.getItem("token");

    if (token) {
      this.setState({ t: true });
    }

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
        <Navbar heading="MT Custom Sneakers" loggedIn={this.state.t} />
        <Gallery />
        <KdoSem />
        <Footer />
      </React.Fragment>
    );
  }
}

export default Neki;
