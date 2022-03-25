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

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="text-decoration-none">
          <span className="navbar-brand mb-0 h1">ONEACADEMY</span>
        </Link>

        <div className="d-flex gap-3 align-items-center" id="menu-links">
          {loggedIn ? (
            <>
              <Link to="/dashboard">
                <NavbarButton className="btn-secondary d-none d-sm-inline">
                  Panel de Control
                </NavbarButton>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-person d-sm-none text-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                </svg>
              </Link>

              <Link
                to="/"
                className="link-light text-uppercase"
                onClick={handleLogout}
              >
                <span className="d-none d-sm-inline">Cerrar sesión</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-door-open-fill d-sm-none text-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15H1.5zM11 2h.5a.5.5 0 0 1 .5.5V15h-1V2zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
                </svg>
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup">
                <NavbarButton
                  className="d-none d-sm-inline"
                  onClick={handleLogin}
                >
                  Registrarse
                </NavbarButton>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-pencil-square d-sm-none text-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
              </Link>

              <Link
                to="/login"
                className="link-light text-uppercase"
                onClick={handleLogin}
              >
                <span className="d-none d-sm-inline">Iniciar sesión</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="currentColor"
                  className="bi bi-key-fill d-sm-none text-white"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                </svg>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
