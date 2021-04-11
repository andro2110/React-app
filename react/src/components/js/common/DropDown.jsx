import React from "react";

const Dropdown = ({ options, onChange, value, id, name, style }) => {
  return (
    <div>
      <span className="m-2">Status: </span>
      <select key={id} value={value} onChange={onChange} id={id} name={name}>
        {options.map((o, i) => {
          return (
            <option key={i} value={o}>
              {o}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Dropdown;
