import React, { Component } from "react";
import Carousel from "react-elastic-carousel";
import Image from "./common/Image";
import pic1 from "../img/homepageCrslImgs/bgpic1.jpg";
import pic2 from "../img/homepageCrslImgs/bgpic2.jpg";
import pic3 from "../img/homepageCrslImgs/bgpic3.jpg";
import "../css/Gallery.css";

class Gallery extends Component {
  state = {
    imgs: [
      {
        id: 0,
        photo: pic1,
        text: "Slika1",
      },
      {
        id: 1,
        photo: pic2,
        text: "Slika2",
      },
      {
        id: 2,
        photo: pic3,
        text: "Slika3",
      },
    ],
  };

  render() {
    const { imgs } = this.state;
    return (
      <React.Fragment>
        <div className="wrapper">
          <div className="carousel_wrapper">
            <Carousel className="carousel" enableAutoPlay autoPlaySpeed={5000}>
              {imgs.map((img) => {
                return <Image slika={img} key={img.id} />;
              })}
            </Carousel>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Gallery;
