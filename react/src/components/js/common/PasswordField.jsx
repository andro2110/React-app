import React from "react";

const Password = ({ name, label, value, onChange, error }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        type="password"
        value={value}
        id={name}
        name={name}
        onChange={onChange}
      />
      {error ? <div className="alert alert-danger">{error}</div> : null}
    </div>
  );
};

export default Password;
