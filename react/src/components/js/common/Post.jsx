import React from "react";
import Galerija from "./Galerija";
import "../../css/card.css";

const Post = ({ narocilo, loaded }) => {
  return (
    <div className="card text-dark bg-light mb-3 mw">
      <h1 className="card-header transform-upper">{narocilo.model}</h1>
      <div className="card-body">
        <Galerija slike={narocilo.slike} loaded={loaded} />
        <div className="d-flex">
          <p className="card-text opis">{narocilo.opis}</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
