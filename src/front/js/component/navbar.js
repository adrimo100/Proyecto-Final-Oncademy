import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { NavbarItem } from "./navbarItem";
import "../../styles/navbar.css";
import { Context } from "../store/appContext";

export const Navbar = () => {
  const {
    store: { user },
    actions,
  } = useContext(Context);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="app-container d-flex align-items-center justify-content-between">
        <Link to="/" className="text-decoration-none">
          <span className="navbar-brand mb-0 h1">ONACADEMY</span>
        </Link>

        <div className="d-flex gap-4 align-items-center">
          {user ? (
            <>
              <NavbarItem
                button
                to="/#subjects"
                icon={<i className="bi bi-book" />}
                text="Asignaturas"
              />

              <NavbarItem
                button
                secondary
                to="/dashboard"
                icon={<i className="bi bi-person" />}
                text="Panel de Control"
              />

              <NavbarItem
                icon={<i className="bi bi-box-arrow-right" />}
                text="Cerrar sesión"
                onClick={actions.logout}
              />
            </>
          ) : (
            <>
              <NavbarItem
                button
                to="/signup"
                icon={<i className="bi bi-pencil-square" />}
                text="Registrarse"
              />

              <NavbarItem
                to="/login"
                icon={<i className="bi bi-box-arrow-in-right" />}
                text="Iniciar sesión"
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};


