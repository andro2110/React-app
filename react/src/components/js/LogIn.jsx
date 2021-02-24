import React, { Component } from "react";
import Input from "./common/Input";
import Password from "./common/PasswordField";
import axios from "axios";
import Joi from "joi-browser";
import NavBar from "./NavBar";
import { regularLinks } from "./common/navbarlinks";

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
    zePrijavljen: false,
    t: false,

    errors: { email: "", geslo: "" },
  };

  schema = {
    email: Joi.string().email().required(),
    geslo: Joi.string().required(),
  };

  validate = () => {
    const { account } = this.state;
    const { error } = Joi.validate(account, this.schema, {
      abortEarly: false,
    });

    if (!error) return false;

    const errors = {};

    for (const item of error.details) errors[item.path[0]] = item.message;
    this.setState({ errors });

    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = (ev) => {
    ev.preventDefault();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errMessage = this.validateProperty(input);
    if (errMessage) errors[input.name] = errMessage;
    else delete errors[input.name];

    const account = { ...this.state.account };
    account[input.name] = input.value;
    this.setState({ account, errors });
  };

  login = () => {
    const error = this.validate();
    this.setState({ errors: error || {} });

    if (!error) {
      const { account } = this.state;
      axios
        .post("http://localhost:4000/login", { racun: account })
        .then((response) => {
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
    }
  };

  componentDidMount() {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/login", { withCredentials: true })
      .then((response) => {
        if (response.data.loggedIn) {
          this.setState({
            loggedIn: true,
            text: "notri si",
          });
        }
      });

    if (token) {
      this.setState({ text: "notri si", t: true, zePrijavljen: true });
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
    const { account, errors, t } = this.state;

    return (
      <React.Fragment>
        <NavBar heading="Log in" links={regularLinks} />

        <div className="mt-200 form-box">
          {t ? <p className="alert alert-danger">Si že prijavljen</p> : null}
          <form onSubmit={this.handleSubmit} className="d-flex flex-column">
            <Input
              name="email"
              label="Email: "
              value={account.email}
              onChange={this.handleChange}
              error={errors["email"]}
            />
            <Password
              name="geslo"
              label="Geslo: "
              value={account.geslo}
              onChange={this.handleChange}
              error={errors["geslo"]}
            />
            <button onClick={this.login} id="submit">
              Prijavi se
            </button>
          </form>
          {this.state.loggedIn && !this.state.t && (
            <button onClick={this.userAuth} id="submit">
              Potrdi prijavo
            </button>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
