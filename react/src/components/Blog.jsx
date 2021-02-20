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
    slike: [],

    vzorci: [],
    iskanModel: "",
    iskanOpis: "",
    isciDatumNacin: "",
    selectedPattern: { IDVzorca: 5, Ime: "vsi vzorci" },

    loaded: false,
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
      vz.push({ IDVzorca: 5, Ime: "Vsi vzorci" });

      this.setState({ vzorci: vz });
    });
  }

  loadAllNarocila() {
    axios.get("http://localhost:4000/blog").then((res) => {
      const narocilo = res.data.narocila;
      this.setState({ cards: narocilo });
      this.poveziSlike();
    });
  }

  loadSlike = () => {
    axios.get("http://localhost:4000/vrniBlogSlike").then((res) => {
      const slike = res.data.slike;

      this.setState({ slike });
      this.setState({ loaded: true });
    });
  };

  poveziSlike = () => {
    const { cards, slike } = this.state;

    for (const narocilo of cards) {
      const tmp = [];
      for (const slika of slike) {
        if (slika.narociloId === narocilo.narociloBlogId) tmp.push(slika);
      }
      narocilo["slike"] = tmp;
    }

    this.setState({ cards });
  };

  componentDidMount() {
    this.loadPatterns();
    this.loadSlike();
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
    const { iskanModel, iskanOpis, slike } = this.state;
    this.setState({ selectedPattern: "" });
    axios
      .post("http://localhost:4000/vrniNarocila", { iskanModel, iskanOpis })
      .then((res) => {
        const cards = res.data.narocila;

        for (const card of cards) {
          const tmp = [];
          for (const slika of slike) {
            if (slika.narociloId === card.narociloBlogId) tmp.push(slika);
          }
          card["slike"] = tmp;
        }

        this.setState({ cards });
        this.setState({ iskanModel: "" });
        this.setState({ iskanOpis: "" });
        this.setState({ loaded: true });
      });
  };

  urediPoDatumu = ({ currentTarget: button }) => {
    const tmpNacin = button.name;
    const { isciDatumNacin, slike } = this.state;

    if (isciDatumNacin === tmpNacin) this.setState({ isciDatumNacin: "" });
    else this.setState({ isciDatumNacin: tmpNacin });

    axios.post("http://localhost:4000/vrniDatum", { tmpNacin }).then((res) => {
      const cards = res.data.narocila;

      for (const card of cards) {
        const tmp = [];
        for (const slika of slike) {
          if (slika.narociloId === card.narociloBlogId) tmp.push(slika);
        }
        card["slike"] = tmp;
      }

      this.setState({ cards });
      this.setState({ loaded: true });
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
      loaded,
    } = this.state;

    const filtered =
      selectedPattern && selectedPattern.IDVzorca !== 5
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

          {loaded &&
            filtered.map((c, i) => {
              if (c.slike !== undefined)
                return (
                  <Card
                    key={i}
                    model={c.model}
                    datum={c.datumObjave}
                    opis={c.opis}
                    vzorec={c.vzorec}
                    slike={c.slike}
                    loaded={loaded}
                  />
                );
              return null;
            })}
        </div>
      </React.Fragment>
    );
  }
}

export default Blog;
