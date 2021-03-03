import React from "react";
import Galerija from "./Galerija";
import "../../css/card.css";

const Card = ({ narocilo, loaded, onClick, cardIndex, likedPosts }) => {
  return (
    <div className="card text-dark bg-light mb-3 mw">
      <h1 className="card-header transform-upper">{narocilo.model}</h1>
      <div className="card-body">
        <Galerija slike={narocilo.slike} loaded={loaded} />
        <div className="d-flex">
          <p className="card-text opis">{narocilo.opis}</p>
          <div className="vsecki opis" onClick={onClick} id={cardIndex}>
            {likedPosts.includes(narocilo.IDNarocila) ? (
              <p>{narocilo.vsecki}💔</p>
            ) : (
              <p>{narocilo.vsecki}❤️</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
