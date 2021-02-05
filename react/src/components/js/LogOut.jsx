import { Component } from "react";
import axios from "axios";

class Logout extends Component {
  componentDidMount() {
    localStorage.removeItem("token");

    axios.get("http://localhost:4000/logout").then((response) => {
      console.log(response);
    });

    window.location = "/";
  }
  render() {
    return null;
  }
}

export default Logout;
