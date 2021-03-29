import React, { Component } from "react";
import Navbar from "./js/NavBar";
import Gallery from "./js/Gallery";
import KdoSem from "./js/KdoSem";
import Footer from "./js/Footer";

class Homepage extends Component {
  componentDidMount = () => {
    this.setState({}); //nevem zakaj je tuki, drgac se linki ne spremenijo
  };

  render() {
    return (
      <React.Fragment>
        <Navbar heading="MT Custom Sneakers" />
        <Gallery />
        <KdoSem />
        <Footer />
      </React.Fragment>
    );
  }
}

export default Homepage;
