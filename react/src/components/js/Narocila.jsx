import React, { Component } from "react";
import Input from "./common/Input";
import axios from "axios";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import NavBar from "./NavBar";
import { regularLinks } from "./common/navbarlinks";

class Narocila extends Component {
  state = {
    narocilo: {
      model: "",
      stevilka: "",

      opis: "",

      barva: "",
    },

    dodatki: {
      nacinPlacila: "Ob prejemu",
      status: "prejeto",
      vzorec: "4",
    },

    vzorci: [], //not se shranjo vzorci iz pb

    token: "",

    slike: "",
    selectedFile: null,
    sentSuccessful: "",
    isSent: false,

    errors: {},
    redirect: false,
  };

  schema = {
    model: Joi.string().required(),
    stevilka: Joi.number().max(50).min(10).required(),
    opis: Joi.string().required(),
    barva: Joi.string().required(),
  };

  loadPatterns() {
    //dobi vzorce iz pb
    axios.get("http://localhost:4000/vzorci").then((response) => {
      const vz = response.data.data;

      this.setState({ vzorci: vz });
    });
  }

  componentDidMount() {
    const t = localStorage.getItem("token");
    this.setState({ token: t });

    this.loadPatterns();
  }

  componentWillUnmount() {
    clearTimeout(this.red);
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
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

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errMessage = this.validateProperty(input);
    if (errMessage) errors[input.name] = errMessage;
    else delete errors[input.name];

    const narocilo = { ...this.state.narocilo };
    narocilo[input.name] = input.value;
    this.setState({ narocilo, errors });
  };

  fileChange = (e) => {
    this.setState({ slike: e.target.files });
  };

  posljiNarocilo = () => {
    const { narocilo, token, dodatki } = this.state;
    const error = this.validate();
    this.setState({ errors: error || {} });

    if (!error) {
      axios
        .post("http://localhost:4000/narocila", {
          narocilo,
          token,
          dodatki,
        }) //poslje podatke na server
        .then((res) => {
          if (res.data.dodatekId) {
            const { slike } = this.state;
            const did = res.data.dodatekId;

            let counter = 0;
            const stSlik = slike.length;

            const formData = new FormData();
            formData.append("dodatekId", did);
            formData.append("stSlik", stSlik);

            for (const slika of slike) {
              formData.append(`file${counter}`, slika);
              counter++;
            }

            //poslje slike v pb
            axios
              .post("http://localhost:4000/upload", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((res) => {
                const { filePath } = res.data;
                this.setState({ imgSrc: filePath });

                if (res.data.success) {
                  this.setState({ sentSuccessful: res.data.success });
                  this.setState({ isSent: true });

                  this.red = setTimeout(() => {
                    this.setState({ redirect: true });
                  }, 3000);

                  toast.success(
                    "Naročilo uspešno poslano. Čez 3 sekunde boste preusmerjeni na domačo stran.",
                    {
                      position: "top-center",
                      autoClose: 3000,
                    }
                  );
                } else
                  toast.error(res.data.errMessage, {
                    position: "top-center",
                  });
              });
          } else {
            toast.error(res.data.errMessage, {
              position: "top-center",
            });
          }
        });
    }
  };

  handleDodatkiChange = ({ currentTarget: input }) => {
    const dodatki = { ...this.state.dodatki };
    dodatki[input.name] = input.value;
    this.setState({ dodatki });
  };

  render() {
    const { narocilo, vzorci, token, errors, dodatki, redirect } = this.state;

    if (redirect) window.location = "/";

    return (
      <React.Fragment>
        <NavBar heading="Naroči se" links={regularLinks} />
        <div>
          {token === null ? (
            <p className="alert alert-danger">
              Za narocanje se potrebujes prijaviti
            </p>
          ) : null}

          <form onSubmit={this.handleSubmit}>
            <Input
              name="model"
              label="Model: "
              value={narocilo.model}
              onChange={this.handleChange}
              error={errors["model"]}
            />

            <Input
              name="stevilka"
              label="Številka: "
              value={narocilo.stevilka}
              onChange={this.handleChange}
              error={errors["stevilka"]}
            />
            <Input
              name="opis"
              label="Opis: "
              value={narocilo.opis}
              onChange={this.handleChange}
              error={errors["opis"]}
            />
            <Input
              name="barva"
              label="Barva: "
              value={narocilo.barva}
              onChange={this.handleChange}
              error={errors["opis"]}
            />
            <select
              value={dodatki.vzorec}
              name="vzorec"
              id="vzorec"
              onChange={this.handleDodatkiChange}
            >
              {vzorci.map((o) => {
                return (
                  <option key={o.IDVzorca} value={o.IDVzorca}>
                    {o.Ime}
                  </option>
                );
              })}
            </select>

            <input
              type="file"
              name="files[]" //name="files[]"
              id="slika"
              onChange={this.fileChange}
              multiple
              allow=".jpeg, .png, .jpg"
            />

            <br />
            <button onClick={this.posljiNarocilo}>Submit</button>
          </form>

          {/* <p>{this.state.imgSrc}</p> */}
          {/* {isSent ? (
          sentSuccessful ? (
            <p>Uspesno poslano</p>
          ) : (
            <p>Napaka pri posiljanju</p>
          )
        ) : null} */}
        </div>
      </React.Fragment>
    );
  }
}

export default Narocila;
