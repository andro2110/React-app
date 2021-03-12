import React, { Component } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import Post from "./common/Post";

class UserProfile extends Component {
  state = {
    uporabnik: "",
    loaded: false,

    likedPosts: [],

    styles: {
      margin: "135px",
    },
  };

  loadSlike = () => {
    axios
      .get(`${process.env.REACT_APP_SERVER_ADDRESS}/vrniBlogSlike`)
      .then((res) => {
        if (!res.data.errMessage) {
          const slike = res.data.slike;
          this.setState({ slike });
        }
      });
  };

  poveziSlike = () => {
    const { likedPosts, slike } = this.state;

    for (const post of likedPosts) {
      const tmp = [];
      for (const slika of slike) {
        if (slika.narociloId === post.narociloBlogId) tmp.push(slika);
      }
      post["slike"] = tmp;
    }

    this.setState({ likedPosts });
  };

  componentDidMount() {
    this.loadSlike();

    axios //dobi uporabnika
      .get(`${process.env.REACT_APP_SERVER_ADDRESS}/profile`)
      .then((res) => {
        this.setState({ uporabnik: res.data.user[0] });
        const uid = res.data.user[0].IDUporabnika;

        axios //dobi likeane poste
          .post(`${process.env.REACT_APP_SERVER_ADDRESS}/getLikedProfile`, {
            uid,
          })
          .then((res) => {
            const lp = res.data.likedPosts;
            this.setState({ likedPosts: lp });
            this.poveziSlike();
            this.setState({ loaded: true });
          });
      });
  }

  render() {
    const { likedPosts, loaded } = this.state;
    return (
      <React.Fragment>
        <NavBar heading="Profil" loggedIn={this.state.t} />
        <h1 style={this.state.styles}>Živjo {this.state.uporabnik.Ime}!</h1>
        <h2 className="text-center">Tvoja všečkana naročila: </h2>
        <div>
          {likedPosts.length === 0 ? (
            <h4>Nisi všečkal nobenih sporočil</h4>
          ) : null}
          {loaded &&
            likedPosts.map((post, i) => {
              return <Post key={i} narocilo={post} loaded={loaded} />;
            })}
        </div>
      </React.Fragment>
    );
  }
}

export default UserProfile;
