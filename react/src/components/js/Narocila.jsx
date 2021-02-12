import React, { Component } from "react";
import Input from "./common/Input";
import axios from "axios";
import Joi from "joi-browser";

class Narocila extends Component {
  state = {
    // artikel: {
    //   model: "",
    //   stevilka: "",
    // },
    // narocilo: {
    //   nacinPlacila: "Ob prejemu",
    //   opis: "",
    //   status: "prejeto",
    // },

    // dodatki: {
    //   barva: "",
    //   vzorec: "4",
    // },

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

    slika: "",
    selectedFile: null,
    sentSuccessful: "",
    isSent: false,

    errors: {},
  };

  schema = {
    model: Joi.string().required(),
    stevilka: Joi.number().required(),
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
    this.setState({ slika: e.target.files[0] });
  };

  posljiNarocilo = () => {
    const { narocilo, token, dodatki } = this.state;
    const error = this.validate();
    this.setState({ errors: error || {} });
    // console.log(error);

    if (!error) {
      axios
        .post("http://localhost:4000/narocila", {
          narocilo,
          token,
          dodatki,
        }) //poslje podatke na server
        .then((res) => {
          this.setState({ sentSuccessful: res.data.success });
          this.setState({ isSent: true });
          if (res.data.dodatekId) {
            const { slika } = this.state;
            const did = res.data.dodatekId;

            const formData = new FormData();
            formData.append("dodatekId", did);
            formData.append("file", slika);

            axios
              .post("http://localhost:4000/upload", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((response) => {
                const { filePath } = response.data;
                this.setState({ imgSrc: filePath });
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
    const {
      narocilo,
      vzorci,
      token,
      sentSuccessful,
      isSent,
      errors,
      dodatki,
    } = this.state;

    return (
      <div>
        <h1>Naročila</h1>
        {token === null ? <p>Za narocanje se potrebujes prijaviti</p> : null}

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
            name="file" //name="files[]"
            id="slika"
            onChange={this.fileChange}
            multiple
            allow=".jpeg, .png, .jpg"
          />

          <br />
          <button onClick={this.posljiNarocilo}>Submit</button>
        </form>

        <p>{this.state.imgSrc}</p>
        {isSent ? (
          sentSuccessful ? (
            <p>Uspesno poslano</p>
          ) : (
            <p>Napaka pri posiljanju</p>
          )
        ) : null}
      </div>
    );
  }
}

export default Narocila;
