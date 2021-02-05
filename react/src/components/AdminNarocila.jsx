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

    statusi: ["prejeto", "vdelu", "koncano"],
    tmpStatus: "",
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

  componentDidMount() {
    axios.post("http://localhost:4000/adminNarocila").then((response) => {
      const narocilo = response.data.narocila;

      this.setState({ narocila: narocilo });
    });
  }

  klik = ({ currentTarget: input }) => {
    console.log(input.value);
  };

  render() {
    const { narocila, styles } = this.state;
    return (
      <React.Fragment>
        <NavBar heading="Admin" />
        {/*dodaj se props - links (napiss not kere linke uporabi*/}

        <div style={styles}>
          {narocila.map((n, i) => {
            return (
              <div key={i} id={i}>
                <Narocilo
                  key={n.Id}
                  name="status"
                  stevilka={n.Stevilka}
                  model={n.model}
                  barva={n.barva}
                  nacinPlacila={n.nacinPlacila}
                  opis={n.opis}
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
      </React.Fragment>
    );
  }
}

export default AdminNarocila;

// narocila: [
//   {
//     Id: "",
//     nacinPlacila: "",
//     opis: "",
//     status: "",
//     model: "",
//     stevilka: "",
//     barva: "",
//   },
// ],
