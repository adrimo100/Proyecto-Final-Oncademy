import React from "react";
import { Link } from "react-router-dom";

export const NavbarButton = ({ children, className, to, ...props }) => (
  <Link to={to}>
    <button
      className={
        "btn btn-primary me-3 border-light rounded-pill text-uppercase " +
          className || ""
      }
      {...props}
    >
      {children}
    </button>
  </Link>
);
