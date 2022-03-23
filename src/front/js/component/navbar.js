import React, { useState } from "react";
import { Link } from "react-router-dom";
import { NavbarButton } from "./navbar-button";
import "../../styles/navbar.css";

export const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  function handleLogin(event) {
    event.preventDefault();
    setLoggedIn(true);
  }

  function handleLogout(event) {
    event.preventDefault();
    setLoggedIn(false);
  }

  const SignUpButton = () => (
    <NavbarButton onClick={handleLogin}> Registrarse </NavbarButton>
  );
  const DashboardButton = () => (
    <NavbarButton to="/dashboard" className="btn-secondary">
      Panel de Control
    </NavbarButton>
  );

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="text-decoration-none">
          <span className="navbar-brand mb-0 h1">ONEACADEMY</span>
        </Link>
        <div className="ml-auto">
          {loggedIn ? (
            <>
              <DashboardButton />
              <a
                href="#"
                className="link-light text-uppercase"
                onClick={handleLogout}
              >
                Cerrar sesión
              </a>
            </>
          ) : (
            <>
              <SignUpButton />
              <a
                href="#"
                className="link-light text-uppercase"
                onClick={handleLogin}
              >
                Iniciar sesión
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
