import React, { Component } from "react";
import "../css/Gallery.css";
import leftArrow from "../img/LeftArrow.svg";
import rightArrow from "../img/RightArrow.svg";

class Gallery extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <div className="gallery"> </div>
        <div className="buttons">
          <img src={leftArrow} alt="leftArrow" />
          <img src={rightArrow} alt="rightArrow" />
        </div>
      </React.Fragment>
    );
  }
}

export default Gallery;
