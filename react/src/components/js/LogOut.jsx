import { Component } from "react";
import axios from "axios";

class Logout extends Component {
  componentDidMount() {
    localStorage.removeItem("token");

    axios
      .get(`${process.env.REACT_APP_SERVER_ADDRESS}/logout`)
      .then((response) => {
        console.log(response);
      });

    window.location = "/";
  }
  render() {
    return null;
  }
}

export default Logout;
