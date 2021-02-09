import axios from "axios";
import React, { Component } from "react";
import NavBar from "./js/NavBar";
import Narocilo from "./js/common/Narocilo";
import Dropdown from "./js/common/DropDown";

class AdminNarocila extends Component {
  state = {
    narocila: [],

    styles: {
      margin: "100px",
    },

    test: {
      display: "block",
    },

    statusi: ["vsi statusi", "prejeto", "vdelu", "koncano"],
    tmpStatus: "",
    isciDatumNacin: "",
    selectedStatus: "",
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

  test = ({ currentTarget: input }) => {
    const { narocila } = this.state;
    const narocilo = narocila[input.id];

    axios.post("http://localhost:4000/test", { narocilo }).then((res) => {
      window.location = "/adminBlog";
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
          console.log(res.data.message);
          narocila[index]["Status"] = val;
          this.setState({ narocila: narocila });
        } else {
          console.log(res.data.message);
        }
      });
  };

  handleSelectedStatusChange = ({ currentTarget: input }) => {
    this.setState({ selectedStatus: input.value });
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
        console.log(cards);

        this.setState({ narocila: cards });
      });
  };

  componentDidMount() {
    axios.post("http://localhost:4000/adminNarocila").then((response) => {
      const narocilo = response.data.narocila;

      this.setState({ narocila: narocilo });
    });
  }

  render() {
    const { narocila, styles, isciDatumNacin, selectedStatus } = this.state;

    const filtered =
      selectedStatus && selectedStatus !== "vsi statusi"
        ? narocila.filter((n) => n.Status === selectedStatus)
        : narocila;

    return (
      <React.Fragment>
        <NavBar heading="Admin" />
        {/*dodaj se props - links (napiss not kere linke uporabi*/}

        <div style={styles}>
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
                  nacinPlacila={n.NacinPlacila}
                  opis={n.Opis}
                  status={n.Status}
                  statuses={this.state.statusi}
                  narociloIndex={i}
                  onClick={this.test}
                />
                <Dropdown
                  key={i}
                  options={this.state.statusi}
                  onChange={this.handleStatusChange}
                  value={n.Status}
                  id={i}
                  style={this.state.test}
                />
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
            style={this.state.test}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default AdminNarocila;
