import React, { Component } from "react";
import Input from "./common/Input";
import Password from "./common/PasswordField";
import axios from "axios";
import Joi from "joi-browser";

class SignUp extends Component {
  state = {
    account: {
      ime: "",
      priimek: "",
      email: "",
      geslo: "",
      hisnaSt: "",
      postSt: null,
      status: "upor",
      kraj: "",
    },
  };

  schema = {
    ime: Joi.string().required(),
    priimek: Joi.string().required(),
    email: Joi.string().email().required(),
    geslo: Joi.string().required(),
    hisnaSt: Joi.string().required(),
    postSt: Joi.number().required(),
    kraj: Joi.string().required(),
  };

  handleSubmit = (ev) => {
    ev.preventDefault();
  };

  handleChange = ({ currentTarget: input }) => {
    const account = { ...this.state.account };
    account[input.name] = input.value;
    this.setState({ account });
  };

  register = () => {
    const { account } = this.state;

    axios
      .post("http://localhost:4000/register", { novRacun: account })
      .then((response) => {
        console.log(response);
      }); /*poslje podatke na server */
  };

  render() {
    const { account } = this.state;

    return (
      <div>
        <h1>Sign up</h1>
        <form onSubmit={this.handleSubmit}>
          <Input
            name="ime"
            label="Ime: "
            value={account.ime}
            onChange={this.handleChange}
          />
          <Input
            name="priimek"
            label="Priimek: "
            value={account.priimek}
            onChange={this.handleChange}
          />
          <Input
            name="email"
            label="E - mail: "
            value={account.email}
            onChange={this.handleChange}
          />
          <Password
            name="geslo"
            label="Geslo:"
            value={account.geslo}
            onChange={this.handleChange}
          />
          <Input
            name="hisnaSt"
            label="Ulica in hišna št.: "
            value={account.hisnaSt}
            onChange={this.handleChange}
          />
          <label>Poštna številka: </label>
          <input
            name="postSt"
            value={account.postSt}
            id="postSt"
            type="number"
            onChange={this.handleChange}
          />
          <Input
            name="kraj"
            value={account.kraj}
            id="kraj"
            label="Kraj: "
            onChange={this.handleChange}
          />
          <button onClick={this.register}>Sign up</button>
        </form>
      </div>
    );
  }
}

export default SignUp;
