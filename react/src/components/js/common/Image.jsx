import React from "react";
import "../../css/Gallery.css";

const Image = ({ slika }) => {
  return (
    <div className="card_wrapper">
      <img src={slika.photo} alt={slika.text} className="h-200" />
    </div>
  );
};

export default Image;
