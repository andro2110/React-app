import React from "react";
import "../css/Blog.css";

const ListGroup = (props) => {
  const { items, onPatternSelect, selectedPattern } = props;

  return (
    <ul className="list-group" role="tablist">
      {items.map((item, i) => (
        <li
          onClick={() => onPatternSelect(item)}
          key={i}
          className={
            item.IDVzorca === selectedPattern.IDVzorca
              ? "list-group-item active"
              : "list-group-item"
          }
        >
          {item.ime}
        </li>
      ))}
    </ul>
  );
};

export default ListGroup;
