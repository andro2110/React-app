import React from "react";

const Password = ({ name, label, value, onChange, error }) => {
  return (
    <div className="m-3">
      <label htmlFor={name}>{label}</label>
      <input
        type="password"
        value={value}
        id={name}
        name={name}
        onChange={onChange}
        className={
          !error
            ? "border border-success form-control"
            : "border border-danger form-control"
        }
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

export default Password;
