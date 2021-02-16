import React from "react";
import Galerija from "./Galerija";
import "../../css/card.css";

const Card = ({ model, opis, filePath, slike, loaded }) => {
  return (
    <div className="Card">
      <h1>{model}</h1>
      {/* <img src={filePath} alt="slika" className="Slika" /> */}
      {loaded ? <Galerija slike={slike} /> : null}

      <div className="Opis">
        <p>{opis}</p>
      </div>
    </div>
  );
};

export default Card;
