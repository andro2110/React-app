import React, { Component } from "react";
import axios from "axios";
import Joi from "joi-browser";

class AdminBlog extends Component {
  state = {
    narocilo: "",

    opis: "",
    slika: "",
    isSent: "",
  };

  schema = {
    opis: Joi.string().required(),
  };

  fileChange = (f) => {
    this.setState({ slika: f.target.files[0] });
  };

  handleOpisChange = ({ currentTarget: input }) => {
    this.setState({ opis: input.value });
  };

  objavi = () => {
    const { opis, narocilo } = this.state;

    axios
      .post("http://localhost:4000/vTabeloObjav", {
        opis,
        IDNarocila: narocilo.IDNarocila,
      })
      .then((res) => {
        if (res.data.success) {
          const { slika } = this.state;
          const nid = res.data.narociloBlogId;

          const formData = new FormData();
          formData.append("narociloId", nid);
          formData.append("slika", slika);

          axios
            .post("http://localhost:4000/vSlikeObjav", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              if (res.data.success) window.location = "/adminNarocila";
            });
        }
      });
  };

  test = () => {
    axios.get("http://localhost:4000/test").then((res) => {
      console.log(res);
    });
    window.location = "/";
  };

  componentDidMount() {
    axios.get("http://localhost:4000/adminBlog").then((res) => {
      const n = res.data.narocilo;
      this.setState({ narocilo: n });
    });
  }
  handleSubmit = (ev) => {
    ev.preventDefault();
  };

  render() {
    return (
      <React.Fragment>
        <h1>admin blog</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="opis">Opis</label>
          <input
            type="text"
            value={this.state.opis}
            name="opis"
            id="opis"
            onChange={this.handleOpisChange}
          />

          <input
            type="file"
            name="slika"
            id="slika"
            onChange={this.fileChange}
          />

          <button onClick={this.objavi}>Objavi</button>
        </form>
      </React.Fragment>
    );
  }
}

export default AdminBlog;
