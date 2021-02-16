import axios from "axios";
import React, { Component } from "react";
import NavBar from "./js/NavBar";
import Narocilo from "./js/common/Narocilo";
import Dropdown from "./js/common/DropDown";

class AdminNarocila extends Component {
  state = {
    narocila: [],
    slike: [],

    styles: {
      margin: "100px",
    },

    statusi: ["vsi statusi", "prejeto", "vdelu", "koncano"],
    narocilaStatusi: ["prejeto", "vdelu", "koncano"],
    tmpStatus: "",
    isciDatumNacin: "",
    selectedStatus: "",

    feedback: {
      success: null,
      sporocilo: "",
    },
    loaded: false,
  };

  // checkUser() {
  //   const token = localStorage.getItem("token");

  //   axios
  //     .post("http://localhost:4000/adminNarocila", { token })
  //     .then((response) => {
  //       // console.log(response.data.admin);
  //       if (!response.data.admin) window.location = "/";
  //     });
  // }

  odpriUpload = ({ currentTarget: input }) => {
    const { narocila } = this.state;
    const narocilo = narocila[input.id];

    axios.post("http://localhost:4000/test", { narocilo }).then((res) => {
      if (narocilo.Status === "koncano") window.location = "/adminBlog";
    });
  };

  handleStatusChange = ({ currentTarget: input }) => {
    const { narocila } = this.state;
    const val = input.value;
    const index = input.id;
    const narocilo = { val, index: narocila[index].IDNarocila };

    axios
      .post("http://localhost:4000/updateNarocila", {
        narocilo,
      })
      .then((res) => {
        if (res.data.success) {
          const obj = { ...this.state.feedback };
          obj["success"] = res.data.success;
          obj["sporocilo"] = res.data.message;
          this.setState({ feedback: obj });

          narocila[index]["Status"] = val;
          this.setState({ narocila: narocila });
        } else {
          const obj = { ...this.state.feedback };
          obj["success"] = res.data.success;
          obj["sporocilo"] = res.data.message;
          this.setState({ feedback: obj });
        }
      });
  };

  handleSelectedStatusChange = ({ currentTarget: input }) => {
    this.setState({ selectedStatus: input.value });
    const obj = { ...this.state.feedback };
    obj["success"] = null;
    obj["sporocilo"] = "";
    this.setState({ feedback: obj });
  };

  urediPoDatumu = ({ currentTarget: button }) => {
    const tmpNacin = button.name;
    const { isciDatumNacin } = this.state;

    if (isciDatumNacin === tmpNacin) this.setState({ isciDatumNacin: "" });
    else this.setState({ isciDatumNacin: tmpNacin });

    axios
      .post("http://localhost:4000/vrniNarocilaDatum", { tmpNacin })
      .then((res) => {
        const cards = res.data.narocila;

        this.setState({ narocila: cards });
      });
  };

  getSlike = () => {
    const { narocila, slike } = this.state;
    // console.log(slike);

    for (const narocilo of narocila) {
      const tmp = [];
      for (const slika of slike) {
        if (narocilo.IDDodatka === slika.IDDodatka) {
          tmp.push(slika);
        }
      }
      narocilo["slike"] = tmp;
    }
    this.setState({ narocila: narocila });
    this.setState({ loaded: true });
    // console.log(narocila);
  };

  componentDidMount() {
    axios.get("http://localhost:4000/vrniAdminSlike").then((res) => {
      const slike = res.data.slike;
      this.setState({ slike });
    });

    axios.get("http://localhost:4000/adminNarocila").then((response) => {
      const narocila = response.data.narocila;
      this.setState({ narocila });

      this.getSlike();
    });
  }

  render() {
    const {
      narocila,
      styles,
      isciDatumNacin,
      selectedStatus,
      feedback,
      loaded,
    } = this.state;

    const filtered =
      selectedStatus && selectedStatus !== "vsi statusi"
        ? narocila.filter((n) => n.Status === selectedStatus)
        : narocila;

    return (
      <React.Fragment>
        <NavBar heading="Admin" />
        {/*dodaj se props - links (napiss not kere linke uporabi*/}

        <div style={styles}>
          {feedback.success ? (
            <p className="alert alert-success">{feedback.sporocilo}</p>
          ) : !feedback.success && feedback.success !== null ? (
            <p className="alert alert-danger">{feedback.sporocilo}</p>
          ) : null}

          {filtered.length === 0 ? <h1>Ni zadetkov</h1> : null}
          {filtered.map((n, i) => {
            return (
              <div key={i} id={i}>
                <Narocilo
                  key={n.Id}
                  name="status"
                  stevilka={n.Stevilka}
                  model={n.model}
                  barva={n.barva}
                  nacinPlacila={n.nacinPlacila}
                  opis={n.Opis}
                  slike={n.slike}
                  status={n.Status}
                  statuses={this.state.statusi}
                  narociloIndex={i}
                  onClick={this.odpriUpload}
                  options={this.state.narocilaStatusi}
                  onStatusChange={this.handleStatusChange}
                  statusValue={n.Status}
                  loaded={loaded}
                />
                {/* <Dropdown
                  key={i}
                  options={this.state.narocilaStatusi}
                  onChange={this.handleStatusChange}
                  value={n.Status}
                  id={i}
                /> */}
              </div>
            );
          })}
        </div>

        <div className="Kriteriji">
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

          <Dropdown
            options={this.state.statusi}
            onChange={this.handleSelectedStatusChange}
            // value={n.Status}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default AdminNarocila;
