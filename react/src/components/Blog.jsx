import React, { Component } from "react";
import axios from "axios";
import Card from "./js/common/Card";
import NavBar from "./js/NavBar";
import ListGroup from "./js/listGroup";
import Input from "./js/common/Input";

class Blog extends Component {
  state = {
    cards: [],
    styles: {
      margin: "102px",
    },

    vzorci: [],
    iskanModel: "",
    iskanOpis: "",
    isciDatumNacin: "",
    selectedPattern: "Vsi vzorci",
  };

  handleSearchModel = ({ currentTarget: input }) => {
    this.setState({ iskanModel: input.value });
  };

  handleSearchOpis = ({ currentTarget: input }) => {
    this.setState({ iskanOpis: input.value });
  };

  loadPatterns() {
    //dobi vzorce iz pb
    axios.get("http://localhost:4000/vzorci").then((response) => {
      const vz = response.data.data;
      vz.push({ Ime: "Vsi vzorci" });

      this.setState({ vzorci: vz });
    });
  }

  loadAllNarocila() {
    axios.get("http://localhost:4000/blog").then((res) => {
      const narocilo = res.data.narocila;
      this.setState({ cards: narocilo });
    });
  }

  componentDidMount() {
    this.loadPatterns();
    this.loadAllNarocila();
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
  };

  handlePatternSelect = (pattern) => {
    this.loadAllNarocila();
    this.setState({ selectedPattern: pattern });
  };

  sendQuery = () => {
    const { iskanModel, iskanOpis } = this.state;
    this.setState({ selectedPattern: "" });
    axios
      .post("http://localhost:4000/vrniNarocila", { iskanModel, iskanOpis })
      .then((res) => {
        const cards = res.data.narocila;

        this.setState({ cards: cards });
        this.setState({ iskanModel: "" });
        this.setState({ iskanOpis: "" });
      });
  };

  urediPoDatumu = ({ currentTarget: button }) => {
    const tmpNacin = button.name;
    const { isciDatumNacin } = this.state;

    if (isciDatumNacin === tmpNacin) this.setState({ isciDatumNacin: "" });
    else this.setState({ isciDatumNacin: tmpNacin });

    axios.post("http://localhost:4000/vrniDatum", { tmpNacin }).then((res) => {
      const cards = res.data.narocila;
      console.log(cards);

      this.setState({ cards: cards });
    });
  };

  render() {
    const {
      cards,
      vzorci,
      selectedPattern,
      iskanModel,
      iskanOpis,
      isciDatumNacin,
    } = this.state;

    const filtered =
      selectedPattern && selectedPattern.IDVzorca
        ? cards.filter((p) => p.vzorec === selectedPattern.Ime)
        : cards;

    return (
      <React.Fragment>
        <NavBar heading="Blog" />

        <div className="Kriteriji">
          <ListGroup
            items={vzorci}
            selectedPattern={this.state.selectedPattern}
            onPatternSelect={this.handlePatternSelect}
          />

          <button
            onClick={this.urediPoDatumu}
            name="desc"
            className={isciDatumNacin === "desc" ? "active-btn" : ""}
          >
            Najnovejši
          </button>
          <button
            onClick={this.urediPoDatumu}
            name="asc"
            className={isciDatumNacin === "asc" ? "active-btn" : ""}
          >
            Najstarejši
          </button>

          <form onSubmit={this.handleSubmit}>
            <Input
              name="model"
              label="Vnesi iskan model: "
              value={iskanModel}
              onChange={this.handleSearchModel}
            />

            <Input
              name="opis"
              label="Vnesi iskan opis: "
              value={iskanOpis}
              onChange={this.handleSearchOpis}
            />

            <button onClick={this.sendQuery}>Išči</button>
          </form>
        </div>

        <div style={this.state.styles}>
          {filtered.length === 0 ? <h1>Ni zadetkov</h1> : null}

          {filtered.map((c, i) => {
            return (
              <Card
                key={i}
                model={c.model}
                datum={c.datumObjave}
                opis={c.opis}
                vzorec={c.vzorec} //ime je ime vzorca
                filePath={c.lokacijaSlike}
              />
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}

export default Blog;
