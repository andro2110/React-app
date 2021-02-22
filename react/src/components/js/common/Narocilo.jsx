import React from "react";
import Dropdown from "./DropDown";
import Galerija from "./Galerija";

const Narocilo = ({
  narocilo,
  narociloIndex,
  onClick,
  options,
  onStatusChange,
  loaded,
}) => {
  return (
    <div>
      <p onClick={onClick} id={narociloIndex}>
        Model: {narocilo.model}, Stevilka: {narocilo.Stevilka}, Barva:{" "}
        {narocilo.barva}, Nacin placila:
        {narocilo.nacinPlacila}, Opis: {narocilo.Opis}, Status:
      </p>
      <Dropdown
        options={options}
        onChange={onStatusChange}
        value={narocilo.Status}
        key={narociloIndex}
        id={narociloIndex}
      />
      {loaded ? <Galerija slike={narocilo.slike} loaded={loaded} /> : null}
    </div>
  );
};

export default Narocilo;
