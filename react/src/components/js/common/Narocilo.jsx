import React from "react";
import Dropdown from "./DropDown";
import Galerija from "./Galerija";

const Narocilo = ({
  stevilka,
  barva,
  model,
  nacinPlacila,
  opis,
  narociloIndex,
  onClick,
  options,
  onStatusChange,
  statusValue,
  slike,
  loaded,
}) => {
  return (
    <div>
      <p onClick={onClick} id={narociloIndex}>
        Model: {model}, Stevilka: {stevilka}, Barva: {barva}, Nacin placila:
        {nacinPlacila}, Opis: {opis}, Status:
      </p>
      <Dropdown
        options={options}
        onChange={onStatusChange}
        value={statusValue}
        key={narociloIndex}
        id={narociloIndex}
      />
      {loaded ? <Galerija slike={slike} /> : null}
    </div>
  );
};

export default Narocilo;
