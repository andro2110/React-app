import React from "react";

const Input = ({ name, label, value, onChange, error }) => {
  // console.log(error[name]);
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
      {/* {error !== null ? <div>{error[name]}</div> : null} */}
    </div>
  );
};

export default Input;
