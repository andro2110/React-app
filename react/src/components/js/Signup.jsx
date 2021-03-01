import React, { Component } from "react";
import Input from "./common/Input";
import Password from "./common/PasswordField";
import NavBar from "./NavBar";
import axios from "axios";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import { regularLinks } from "./common/navbarlinks";

class SignUp extends Component {
  state = {
    account: {
      ime: "",
      priimek: "",
      email: "",
      geslo: "",
      hisnaSt: "",
      postSt: "",
      status: "upor",
      kraj: "",
    },

    errors: {},
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

  validate = () => {
    const { narocilo } = this.state;
    const { error } = Joi.validate(narocilo, this.schema, {
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

  register = () => {
    const { account } = this.state;
    const error = this.validate();
    this.setState({ errors: error || {} });

    if (!error) {
      axios
        .post(`${process.env.REACT_APP_SERVER_ADDRESS}/register`, {
          novRacun: account,
        })
        .then((res) => {
          if (!res.data.errMessage && !res.data.accExists) {
            toast.success("Račun uspešno ustvarjen", {
              position: "top-center",
            });
          } else if (res.data.accExists) {
            toast.error("Račun že obstaja.", {
              position: "top-center",
            });
          } else {
            toast.error(res.data.errMessage, { position: "top-center" });
          }
        }); /*poslje podatke na server */
    }
  };

  render() {
    const { account, errors } = this.state;

    return (
      <React.Fragment>
        <NavBar heading="Ustvari račun" links={regularLinks} />
        <div className="signup-bgPic">
          <div className="form-box">
            <form
              onSubmit={this.handleSubmit}
              className="d-flex flex-column pb-3"
            >
              <Input
                name="ime"
                label="Ime: "
                value={account.ime}
                onChange={this.handleChange}
                error={errors["ime"]}
              />
              <Input
                name="priimek"
                label="Priimek: "
                value={account.priimek}
                onChange={this.handleChange}
                error={errors["priimek"]}
              />
              <Input
                name="email"
                label="E - mail: "
                value={account.email}
                onChange={this.handleChange}
                error={errors["email"]}
              />
              <Password
                name="geslo"
                label="Geslo:"
                value={account.geslo}
                onChange={this.handleChange}
                error={errors["geslo"]}
              />

              <Input
                name="hisnaSt"
                label="Ulica in hišna št.: "
                value={account.hisnaSt}
                onChange={this.handleChange}
                error={errors["hisnaSt"]}
              />

              <div className="m-3">
                <label htmlFor="postSt" className="form-label">
                  Poštna številka:
                </label>
                <input
                  name="postSt"
                  value={account.postSt}
                  id="postSt"
                  type="number"
                  onChange={this.handleChange}
                  aria-describedby="err"
                  className="form-control"
                />
                {errors["postSt"] ? (
                  <div
                    id="err"
                    className="alert alert-danger form-text mv-d"
                    role="alert"
                  >
                    {errors["postSt"]}
                  </div>
                ) : null}
              </div>

              {/* <Input
            name="kraj"
            value={account.kraj}
            id="kraj"
            label="Kraj: "
            onChange={this.handleChange}
            error={errors["kraj"]}
          /> */}
              <button onClick={this.register} id="submit">
                Sign up
              </button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SignUp;
