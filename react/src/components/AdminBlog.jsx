import React, { Component } from "react";
import axios from "axios";
import Joi from "joi-browser";

class AdminBlog extends Component {
  state = {
    narocilo: "",

    opis: "",
    slike: "",
    isSent: "",
  };

  schema = {
    opis: Joi.string().required(),
  };

  fileChange = (f) => {
    this.setState({ slike: f.target.files });
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
          const { slike } = this.state;
          const nid = res.data.narociloBlogId;

          const stSlik = slike.length;
          let counter = 0;

          const formData = new FormData();
          formData.append("narociloId", nid);
          formData.append("stSlik", stSlik);

          for (const slika of slike) {
            formData.append(`file${counter}`, slika);
            counter++;
          }

          axios
            .post("http://localhost:4000/vSlikeObjav", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              // if (res.data.success) window.location = "/adminNarocila";
              console.log(res.data);
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
    const { narocilo } = this.state;
    console.log(narocilo);
    return (
      <React.Fragment>
        <h1>admin blog</h1>
        <div>
          Model: {narocilo.model}, opis: {narocilo.Opis}
        </div>

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
            name="files[]"
            id="slika"
            onChange={this.fileChange}
            multiple
          />

          <button onClick={this.objavi}>Objavi</button>
        </form>
      </React.Fragment>
    );
  }
}

export default AdminBlog;
