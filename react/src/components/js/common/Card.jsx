import React from "react";
import Galerija from "./Galerija";
import "../../css/card.css";

const Card = ({ model, opis, slike, loaded }) => {
  return (
    <div className="card text-dark bg-light mb-3 mw">
      <h1 className="card-header transform-upper">{model}</h1>
      <div className="card-body">
        <Galerija slike={slike} loaded={loaded} />
        <p className="card-text opis">{opis}</p>
      </div>
    </div>
  );
};

export default Card;
