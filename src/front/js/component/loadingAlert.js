import React from "react";
import "../../styles/loadingAlert.css";
import { Spinner } from "./spinner";

export const LoadingAlert = ({ text }) => (
  <div className="app-container py-4 loading-alert">
    <span className="me-3">{text}</span>
    <Spinner />
  </div>
);
