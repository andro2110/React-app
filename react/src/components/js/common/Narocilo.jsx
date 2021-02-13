import React from "react";
import Dropdown from "./DropDown";

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
}) => {
  // console.log(statusValue);
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
    </div>
  );
};

export default Narocilo;
