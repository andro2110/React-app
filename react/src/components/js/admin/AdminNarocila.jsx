import axios from "axios";
import React, { Component } from "react";
import NavBar from "../NavBar";
import Narocilo from "../common/Narocilo";
import Dropdown from "../common/DropDown";
import { toast } from "react-toastify";
import { adminLinks } from "../helpers/navbarlinks";
import AddPattern from "./DodajVzorec";
import "../../css/Blog.css";

class AdminNarocila extends Component {
  state = {
    narocila: [],
    slike: [],

    styles: {
      margin: "7rem",
    },

    statusi: ["Vsa naročila", "prejeto", "vdelu", "koncano"],
    narocilaStatusi: ["prejeto", "vdelu", "koncano"],
    tmpStatus: "",
    isciDatumNacin: "desc",
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

    axios
      .post(`${process.env.REACT_APP_SERVER_ADDRESS}/redirect`, { narocilo })
      .then((res) => {
        if (narocilo.status === "koncano") window.location = "/adminBlog";
      });
  };

  handleStatusChange = ({ currentTarget: input }) => {
    const { narocila } = this.state;
    const val = input.value;
    const index = input.id;
    const narocilo = { val, index: narocila[index].IDNarocila };

    axios
      .post(`${process.env.REACT_APP_SERVER_ADDRESS}/updateNarocila`, {
        narocilo,
      })
      .then((res) => {
        if (res.data.success) {
          const obj = { ...this.state.feedback };
          obj["success"] = res.data.success;
          obj["sporocilo"] = res.data.message;
          this.setState({ feedback: obj });

          narocila[index]["status"] = val;
          this.setState({ narocila: narocila });

          toast.success(res.data.message, { position: "top-center" });
        } else {
          const obj = { ...this.state.feedback };
          obj["success"] = res.data.success;
          obj["sporocilo"] = res.data.message;
          this.setState({ feedback: obj });

          toast.error(res.data.message, { position: "top-center" });
        }
      });

    axios
      .post(`${process.env.REACT_APP_SERVER_ADDRESS}/getUserId`, {
        narocilo,
        val,
      })
      .then((res) => {
        if (res.data.errMessage) {
          toast.error(res.data.message, { position: "top-center" });
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
    const { isciDatumNacin, slike } = this.state;

    if (isciDatumNacin === tmpNacin) this.setState({ isciDatumNacin: "" });
    else this.setState({ isciDatumNacin: tmpNacin });

    axios
      .post(`${process.env.REACT_APP_SERVER_ADDRESS}/vrniNarocilaDatum`, {
        tmpNacin,
      })
      .then((res) => {
        if (!res.data.errMessage) {
          const cards = res.data.narocila;

          for (const card of cards) {
            const tmp = [];
            for (const slika of slike) {
              if (slika.IDDodatka === card.IDDodatka) tmp.push(slika);
            }
            card["slike"] = tmp;
          }

          this.setState({ narocila: cards });
        }
      });
  };

  getSlike = () => {
    const { narocila, slike } = this.state;

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
  };

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_SERVER_ADDRESS}/vrniAdminSlike`)
      .then((res) => {
        const slike = res.data.slike;
        this.setState({ slike });
      });

    axios
      .get(`${process.env.REACT_APP_SERVER_ADDRESS}/adminNarocila`)
      .then((response) => {
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
      loaded,
    } = this.state;

    const filtered =
      selectedStatus && selectedStatus !== "Vsa naročila"
        ? narocila.filter((n) => n.status === selectedStatus)
        : narocila;

    return (
      <React.Fragment>
        <NavBar heading="Admin" links={adminLinks} />

        <div className="addPattern">
          <AddPattern />
        </div>

        <div className="kriteriji_wrapper">
          <div className="date_wrapper">
            <button
              onClick={this.urediPoDatumu}
              name="desc"
              className={
                isciDatumNacin === "desc"
                  ? "active-button button_date button"
                  : "button_date button"
              }
            >
              Najnovejši
            </button>
            <button
              onClick={this.urediPoDatumu}
              name="asc"
              className={
                isciDatumNacin === "asc"
                  ? "active-button button_date button"
                  : "button_date button"
              }
            >
              Najstarejši
            </button>
          </div>
          <div className="status_box">
            <Dropdown
              options={this.state.statusi}
              onChange={this.handleSelectedStatusChange}
              // value={status}
            />
          </div>
        </div>

        <div style={styles} className="min_h">
          {/* {feedback.success ? (
            <p className="alert alert-success">{feedback.sporocilo}</p>
          ) : !feedback.success && feedback.success !== null ? (
            <p className="alert alert-danger">{feedback.sporocilo}</p>
          ) : null} */}

          {filtered.length === 0 ? (
            <h1 className="text-center">Ni zadetkov</h1>
          ) : null}
          {filtered.map((n, i) => {
            return (
              <div key={i}>
                <Narocilo
                  key={n.Id}
                  narocilo={n}
                  name="status"
                  status={n.status}
                  statuses={this.state.statusi}
                  narociloIndex={i}
                  onClick={this.odpriUpload}
                  options={this.state.narocilaStatusi}
                  onStatusChange={this.handleStatusChange}
                  loaded={loaded}
                />
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}

export default AdminNarocila;
