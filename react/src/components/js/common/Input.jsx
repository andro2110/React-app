import React from "react";

const Input = ({ name, label, value, onChange }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        type="text"
        id={name}
        name={name}
      />
    </div>
  );
};

export default Input;
