import React from "react";
import Dropdown from "./DropDown";
import Galerija from "./Galerija";
import { addPointer, removePointer } from "../helpers/toggleMouseHelper";

const Narocilo = ({
  narocilo,
  narociloIndex,
  onClick,
  options,
  onStatusChange,
  loaded,
}) => {
  const datum = narocilo.datum.slice(0, 10);
  return (
    <div className="card text-dark bg-light mb-3 mw">
      <div className="d-block clickable" onClick={onClick} id={narociloIndex}>
        <div className="card-header d-flex justify-content-between">
          <h5 className="m-2">
            Model:{" "}
            <span className="transform-upper bold">{narocilo.model}</span>
          </h5>
          <h5 className="m-2">
            Prejeto: <span className="bold">{datum}</span>
          </h5>
        </div>

        <div className="opis">
          <p>Stevilka: {narocilo.stevilka}</p>
          <p>Barva: {narocilo.barva}</p>
          <p>Nacin placila: {narocilo.nacinPlacila}</p>
          <p>Opis: {narocilo.opis}</p>
          <p>Izbran vzorec: {narocilo.vzorec}</p>
        </div>
      </div>
      <Dropdown
        options={options}
        onChange={onStatusChange}
        value={narocilo.status}
        key={narociloIndex}
        id={narociloIndex}
      />
      {loaded ? <Galerija slike={narocilo.slike} loaded={loaded} /> : null}
    </div>
  );
};

export default Narocilo;
