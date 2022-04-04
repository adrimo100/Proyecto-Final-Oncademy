import React from "react";
import "../../styles/auth.css";

export const AuthHeader = ({ children }) => (
  <header className="auth-header">
    <div className="app-container text-white h-100 d-flex align-items-center">
      <h1>{children}</h1>
    </div>
  </header>
);
