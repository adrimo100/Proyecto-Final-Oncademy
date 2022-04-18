import { useField } from "formik";
import React from "react";

export const TextField = ({ label, inline, ...props }) => {
  const [field, meta] = useField(props);

  const notValid = meta.touched && meta.error;

  // We have to memoize the wrapper to avoid re-rendering the component
  // every time the field value changes, which causes the browser to lose
  // focus from the input.
  const Wrapper = React.useMemo(
    () =>
      ({ children }) =>
        inline ? children : <div className="mb-3">{children}</div>,
    [inline]
  );

  return (
    <Wrapper>
      <label htmlFor={props.name} className={`form-label ${inline ? "mb-0" : ""}`}>
        {label}
      </label>

      <input
        className={`form-control ${notValid ? "border-danger" : ""}`}
        id={props.name}
        {...field}
        {...props}
      />

      {notValid && <div className="form-text text-danger">{meta.error}</div>}
    </Wrapper>
  );
};
