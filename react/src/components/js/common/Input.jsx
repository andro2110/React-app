import React from "react";

const Input = ({ name, label, value, onChange, error }) => {
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
      {error ? <div className="alert alert-danger">{error}</div> : null}
    </div>
  );
};

export default Input;
