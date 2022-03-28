import { useField } from "formik";
import React from "react";

export const TextField = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const notValid = meta.touched && meta.error;

  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label">
        {label}
      </label>

      <input
        className={`form-control ${notValid ? "border-danger" : ""}`}
        id={props.name}
        {...field}
        {...props}
      />

      {notValid && <div className="form-text text-danger">{meta.error}</div>}
    </div>
  );
};
