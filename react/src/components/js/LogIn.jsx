import React, { Component } from "react";
import Input from "./common/Input";
import Password from "./common/PasswordField";
import axios from "axios";
// import { Redirect } from "react-router-dom";

// let loginStatus = "";
axios.defaults.withCredentials = true; //to rabi bit tuki drgac nebo delal

class Login extends Component {
  state = {
    account: {
      email: "",
      geslo: "",
    },

    loggedIn: false,
    text: "",
    status: "",
  };

  handleSubmit = (ev) => {
    ev.preventDefault();
  };

  handleChange = ({ currentTarget: input }) => {
    const account = { ...this.state.account };
    account[input.name] = input.value;
    this.setState({ account });
  };

  login = () => {
    const { account } = this.state;
    axios
      .post("http://localhost:4000/login", { racun: account })
      .then((response) => {
        console.log(response.data.podatki[0]);
        if (!response.data.auth) {
          this.setState({
            loggedIn: false,
          });

          this.setState({
            text: response.data.message,
          });
        } else {
          this.setState({
            loggedIn: true,
            text: "hej maricka",
          });
          localStorage.setItem("token", response.data.token);

          this.setState({ status: response.data.podatki[0].Status });
        }
      });
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/login", { withCredentials: true })
      .then((response) => {
        if (response.data.loggedIn === true) {
          this.setState({
            loggedIn: true,
            text: "notri si",
          });
        }
      });

    if (token) {
      this.setState({ text: "notri si" });
    }
  }

  userAuth = () => {
    const { status } = this.state;
    axios
      .post("http://localhost:4000/authUser", {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((response) => {
        this.setState({
          text: response.data.message,
        });

        if (status === "upor") window.location = "/";
        else if (status === "admin") window.location = "/adminNarocila";
      });
  };

  render() {
    const { account } = this.state;

    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <Input
            name="email"
            label="Email: "
            value={account.email}
            onChange={this.handleChange}
          />
          <Password
            name="geslo"
            label="Geslo: "
            value={account.geslo}
            onChange={this.handleChange}
          />
          <button onClick={this.login}>Login</button>
        </form>
        {this.state.loggedIn && (
          <button onClick={this.userAuth}>Preveri racun</button>
        )}

        <h1>{this.state.text}</h1>
      </div>
    );
  }
}

export default Login;
