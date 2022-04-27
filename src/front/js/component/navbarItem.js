import React from "react";
import { Link } from "react-router-dom";

export const NavbarButton = ({ children, className, to, ...props }) => (
  <button
    className={
      "btn btn-primary border-light rounded-pill text-uppercase text-decoration-none " +
        className || ""
    }
    {...props}
  >
    {children}
  </button>
);

export const NavbarItem = ({
  button,
  icon,
  text,
  to = "/",
  secondary,
  ...props
}) => {
  if (button)
    return (
      <Link to={to}>
        <button
          {...props}
          className={`btn btn-${
            secondary ? "secondary" : "primary"
          } border-light text-uppercase text-decoration-none `}
        >
          <NavItemText text={text} />
          {icon}
        </button>
      </Link>
    );

  return (
    <Link {...props} to={to} className="link-light text-uppercase">
      <NavItemText text={text} />
      {icon}
    </Link>
  );
};

const NavItemText = ({ text }) => (
  <span className="d-none d-lg-inline me-2">{text}</span>
);
