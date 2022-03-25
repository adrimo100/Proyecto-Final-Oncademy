import React from "react";

export const NavbarButton = ({ children, className, to, ...props }) => (
  <button
    className={
      "btn btn-primary border-light rounded-pill text-uppercase " + className ||
      ""
    }
    {...props}
  >
    {children}
  </button>
);
