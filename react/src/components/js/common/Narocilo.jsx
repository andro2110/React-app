import React from "react";

const Narocilo = ({
  stevilka,
  barva,
  model,
  nacinPlacila,
  opis,
  narociloIndex,
  onClick,
}) => {
  // console.log(narociloIndex);
  return (
    <p onClick={onClick} id={narociloIndex}>
      Model: {model}, Stevilka: {stevilka}, Barva: {barva}, Nacin placila:
      {nacinPlacila}, Opis: {opis}, Status:
    </p>
  );
};

export default Narocilo;
