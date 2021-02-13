import React from "react";
import "../../css/card.css";

const Card = ({ model, datum, opis, vzorec, filePath }) => {
  return (
    <div className="Card">
      <h1>{model}</h1>
      <img src={filePath} alt="slika" className="Slika" />

      <div className="Opis">
        <p>{opis}</p>
      </div>
    </div>
  );
};

export default Card;
