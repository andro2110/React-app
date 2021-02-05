import React from "react";
import "../css/Blog.css";

const ListGroup = (props) => {
  const { items, onPatternSelect, selectedPattern } = props;

  return (
    <ul className="uls">
      {items.map((item, i) => (
        <li
          onClick={() => onPatternSelect(item)}
          key={i}
          className={item === selectedPattern ? "Active" : ""}
        >
          {item.Ime}
        </li>
      ))}
    </ul>
  );
};

export default ListGroup;
