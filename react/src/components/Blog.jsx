import React, { Component } from "react";
import axios from "axios";
import Card from "./js/common/Card";
import NavBar from "./js/NavBar";
import ListGroup from "./js/listGroup";
import Input from "./js/common/formComponents/Input";
import { toast } from "react-toastify";
// import { regularLinks } from "./js/common/navbarlinks";

class Blog extends Component {
  state = {
    cards: [],
    styles: {
      margin: "135px",
    },
    slike: [],

    likedPosts: [],

    vzorci: [],
    iskanModel: "",
    iskanOpis: "",
    isciDatumNacin: "",
    selectedPattern: { IDVzorca: 5, ime: "vsa narocila" },

    loaded: false,
    t: "",
  };

  handleSearchModel = ({ currentTarget: input }) => {
    this.setState({ iskanModel: input.value });
  };

  handleSearchOpis = ({ currentTarget: input }) => {
    this.setState({ iskanOpis: input.value });
  };

  loadPatterns() {
    //dobi vzorce iz pb
    axios
      .get(`${process.env.REACT_APP_SERVER_ADDRESS}/vzorci`)
      .then((response) => {
        const vz = response.data.data;
        vz.push({ IDVzorca: 5, ime: "Vsa naročila" });

        this.setState({ vzorci: vz });
      });
  }

  loadAllNarocila() {
    axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/blog`).then((res) => {
      if (!res.data.errMessage) {
        const narocilo = res.data.narocila;
        this.setState({ cards: narocilo });
        this.poveziSlike();
      } else {
        toast.error(res.data.errMessage, { position: "top-center" });
      }
    });
  }

  loadSlike = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_ADDRESS}/vrniBlogSlike`)
      .then((res) => {
        if (!res.data.errMessage) {
          const slike = res.data.slike;
          this.setState({ slike });
          this.setState({ loaded: true });
        } else {
          toast.error(res.data.errMessage, { position: "top-center" });
        }
      });
  };

  getLikedPosts = () => {
    const { likedPosts } = this.state;
    const token = localStorage.getItem("token");

    axios
      .post(`${process.env.REACT_APP_SERVER_ADDRESS}/getLiked`, { token })
      .then((res) => {
        if (res.data.success) {
          const tmp = res.data.idNarocila;

          for (const id of tmp) {
            likedPosts.push(id.IDNarocila);
          }

          // const ids = Object.values(tmp[0]);
          // console.log(ids);
          this.setState({ likedPosts });
        }
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
    const t = localStorage.getItem("token");
    if (t) {
      this.setState({ t: true });
    }

    this.loadPatterns();
    this.loadSlike();
    this.loadAllNarocila();
    this.getLikedPosts();
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
  };

  selectPattern = (pattern) => {
    const { slike } = this.state;

    axios
      .post(`${process.env.REACT_APP_SERVER_ADDRESS}/listGroup`, { pattern })
      .then((res) => {
        if (!res.data.errMessage) {
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
        } else {
          toast.error(res.data.errMessage, { position: "top-center" });
        }
      });
  };

  sendQuery = () => {
    const { iskanModel, iskanOpis, slike } = this.state;
    this.setState({ selectedPattern: "" });
    axios
      .post(`${process.env.REACT_APP_SERVER_ADDRESS}/vrniNarocila`, {
        iskanModel,
        iskanOpis,
      })
      .then((res) => {
        if (!res.data.errMessage) {
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
        } else {
          toast.error(res.data.errMessage, { position: "top-center" });
        }
      });
  };

  urediPoDatumu = ({ currentTarget: button }) => {
    const tmpNacin = button.name;
    const { isciDatumNacin, slike } = this.state;

    if (isciDatumNacin === tmpNacin) this.setState({ isciDatumNacin: "" });
    else this.setState({ isciDatumNacin: tmpNacin });

    axios
      .post(`${process.env.REACT_APP_SERVER_ADDRESS}/vrniDatum`, { tmpNacin })
      .then((res) => {
        if (!res.data.errMessage) {
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
        } else {
          toast.error(res.data.errMessage, { position: "top-center" });
        }
      });
  };

  handleLikes = ({ currentTarget: card }) => {
    const { cards, likedPosts } = this.state;
    const cardIndex = card.id;
    const vsecki = cards[cardIndex].vsecki;
    const IDNarocila = cards[cardIndex].IDNarocila;
    const idNarocilaBlog = cards[cardIndex].narociloBlogId;
    const t = localStorage.getItem("token");

    if (t) {
      if (!likedPosts.includes(idNarocilaBlog)) {
        //preverja ce tabela vsebuje id
        axios
          .post(`${process.env.REACT_APP_SERVER_ADDRESS}/likePost`, {
            IDNarocila,
            idNarocilaBlog,
            vsecki,
            t,
          })
          .then((res) => {
            if (res.data.success) {
              cards[cardIndex].vsecki++;

              likedPosts.push(idNarocilaBlog);

              this.setState({ cards });
            }
          });
      } else if (vsecki > 0) {
        axios
          .post(`${process.env.REACT_APP_SERVER_ADDRESS}/dislikePost`, {
            IDNarocila,
            idNarocilaBlog,
            vsecki,
            t,
          })
          .then((res) => {
            if (res.data.success) {
              cards[cardIndex].vsecki--;
              likedPosts.splice(likedPosts.indexOf(idNarocilaBlog), 1);

              this.setState({ cards, likedPosts });
            }
          });
      }
    } else {
      toast.warn("Za všečkanje se potrebuješ prijaviti", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  setcards = (pattern) => {
    const { cards } = this.state;

    const filtered = cards.filter((p) => p.vzorec === pattern.ime);

    this.setState({ cards: filtered });
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
        ? cards.filter((p) => p.vzorec === selectedPattern.ime)
        : cards;

    return (
      <React.Fragment>
        <NavBar heading="Blog" />

        <div className="Kriteriji">
          <ListGroup
            items={vzorci}
            selectedPattern={this.state.selectedPattern}
            onPatternSelect={this.selectPattern}
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
          {cards.length === 0 ? <h1>Ni zadetkov</h1> : null}

          {loaded &&
            filtered.map((c, i) => {
              if (c.slike !== undefined)
                return (
                  <Card
                    key={i}
                    narocilo={c}
                    loaded={loaded}
                    onClick={this.handleLikes}
                    cardIndex={i}
                    likedPosts={this.state.likedPosts}
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
