import React, { Component } from "react";
import axios from "axios";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import ProgressBar from "./../common/ProgressBar";

class AdminBlog extends Component {
  state = {
    narocilo: "",

    opis: "",
    slike: "",
    isSent: "",

    uploadProgress: 0,
  };

  schema = {
    opis: Joi.string().required(),

    redirect: false,
  };

  fileChange = (f) => {
    this.setState({ slike: f.target.files });
  };

  handleOpisChange = ({ currentTarget: input }) => {
    this.setState({ opis: input.value });
  };

  componentWillUnmount() {
    clearTimeout(this.red);
    clearTimeout(this.prog);
  }

  objavi = () => {
    const { opis, narocilo } = this.state;

    axios
      .post(`${process.env.REACT_APP_SERVER_ADDRESS}/vTabeloObjav`, {
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
            .post(
              `${process.env.REACT_APP_SERVER_ADDRESS}/vSlikeObjav`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                  this.setState({
                    uploadProgress: parseInt(
                      Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                      )
                    ),
                  });

                  this.prog = setTimeout(() => {
                    this.setState({ uploadProgress: 0 });
                  }, 5000);
                },
              }
            )
            .then((res) => {
              if (res.data.success) {
                this.red = setTimeout(() => {
                  this.setState({ redirect: true });
                }, 3000);

                toast.success("Narocilo uspesno poslano", {
                  position: "top-center",
                  autoClose: 3000,
                });
              } else
                toast.error(res.data.errMessage, { position: "top-center" });
            });
        } else {
          toast.error(res.data.errMessage, { position: "top-center" });
        }
      });
  };

  test = () => {
    axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/test`).then((res) => {
      console.log(res);
    });
    window.location = "/";
  };

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_SERVER_ADDRESS}/adminBlog`)
      .then((res) => {
        const n = res.data.narocilo;
        this.setState({ narocilo: n });
      });
  }
  handleSubmit = (ev) => {
    ev.preventDefault();
  };

  render() {
    const { narocilo, redirect, uploadProgress } = this.state;
    if (redirect) window.location = "/adminNarocila";

    return (
      <React.Fragment>
        <h1>admin blog</h1>
        <div>
          <ProgressBar percentage={uploadProgress} />
          <div>
            Model: {narocilo.model}, opis: {narocilo.opis}
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
              accept="image/x-png,image/gif,image/jpeg"
            />

            <button onClick={this.objavi}>Objavi</button>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminBlog;
