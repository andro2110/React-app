import React from "react";

const Input = ({ name, label, value, onChange, error }) => {
  return (
    <div className="m-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        type="text"
        id={name}
        name={name}
        className="form-control"
        aria-describedby="err"
      />
      {error ? (
        <div
          id="err"
          className="alert alert-danger form-text mv-d"
          role="alert"
        >
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default Input;
