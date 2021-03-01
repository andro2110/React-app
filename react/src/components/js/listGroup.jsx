import React from "react";
import "../css/Blog.css";

const ListGroup = (props) => {
  const { items, onPatternSelect, selectedPattern } = props;

  return (
    <ul className="ul-lists" role="tablist">
      {items.map((item, i) => (
        <li
          onClick={() => onPatternSelect(item)}
          key={i}
          className={item === selectedPattern ? "ul-list-item" : "ul-list-item"}
        >
          {item.ime}
        </li>
      ))}
    </ul>
  );
};

export default ListGroup;
