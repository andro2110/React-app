import React, { Component } from "react";
import Input from "./common/Input";
// import Dropdown from "./common/DropDown";
import axios from "axios";

class Narocila extends Component {
  state = {
    artikel: {
      model: "",
      stevilka: "",
    },
    narocilo: {
      nacinPlacila: "Ob prejemu",
      opis: "",
      status: "prejeto",
    },

    dodatki: {
      barva: "",
      vzorec: "4",
    },

    vzorci: [], //not se shranjo vzorci iz pb

    token: "",

    slika: "",
    selectedFile: null,
    sentSuccessful: "",
    isSent: false,
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

  handleArtikelChange = ({ currentTarget: input }) => {
    this.setState({ isSent: false, sentSuccessful: "" });
    const artikel = { ...this.state.artikel };
    artikel[input.name] = input.value;
    this.setState({ artikel });
  };

  handleNarociloChange = ({ currentTarget: input }) => {
    const narocilo = { ...this.state.narocilo };
    narocilo[input.name] = input.value;
    this.setState({ narocilo });
  };

  handleDodatkiChange = ({ currentTarget: input }) => {
    const dodatki = { ...this.state.dodatki };
    dodatki[input.name] = input.value;
    this.setState({ dodatki });
  };

  handleFileChange = ({ currentTarget: input }) => {
    const dodatki = { ...this.state.dodatki };
    dodatki[input.name] = input.value;
    console.log(input.value);
    this.setState({ dodatki });
  };

  fileChange = (e) => {
    this.setState({ slika: e.target.files[0] });
  };

  posljiNarocilo = () => {
    const { artikel, narocilo, dodatki, token } = this.state;

    axios
      .post("http://localhost:4000/narocila", {
        narocilo,
        artikel,
        dodatki,
        token,
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
            })
            .catch((err) => console.log(err));
        }
      });
  };

  render() {
    const {
      artikel,
      narocilo,
      dodatki,
      vzorci,
      token,
      sentSuccessful,
      isSent,
    } = this.state;

    return (
      <div>
        <h1>Naročila</h1>
        {token === null ? <p>Za narocanje se potrebujes prijaviti</p> : null}
        <form onSubmit={this.handleSubmit}>
          <Input
            name="model"
            label="Model: "
            value={artikel.model}
            onChange={this.handleArtikelChange}
          />
          <Input
            name="stevilka"
            label="Številka: "
            value={artikel.stevilka}
            onChange={this.handleArtikelChange}
          />
          <Input
            name="opis"
            label="Opis: "
            value={narocilo.opis}
            onChange={this.handleNarociloChange}
          />
          <Input
            name="barva"
            label="Barva: "
            value={dodatki.barva}
            onChange={this.handleDodatkiChange}
          />
          {/* <Dropdown
            options={vzorci}
            onChange={this.handlePatternChange}
            val={vzorec}
          />*/}

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
            name="file"
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
