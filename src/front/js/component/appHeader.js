import React from "react";
import "../../styles/header.css";

export const AppHeader = ({ children, className }) => (
  <header className={`app-header ${className ? className : ""}`}>
    <div className="app-container text-white h-100 d-flex align-items-center">
      <h1>{children}</h1>
    </div>
  </header>
);
