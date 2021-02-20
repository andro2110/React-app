import React from "react";
import Galerija from "./Galerija";
import "../../css/card.css";

const Card = ({ model, opis, slike, loaded }) => {
  return (
    <div className="Card">
      <h1>{model}</h1>
      <Galerija slike={slike} loaded={loaded} />
      <div className="Opis">
        <p>{opis}</p>
      </div>
    </div>
  );
};

export default Card;
