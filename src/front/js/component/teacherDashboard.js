import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const TeacherDashboard = () => {
  const { store, actions } = useContext(Context);

  return (
    <main className="app-container container-fluid py-4">
      <div>
        <h2>Tus Datos</h2>
      </div>
      <div className="d-flex">
        <strong>Nombre:</strong>
        <p className="ps-1">{store.user?.full_name}</p>
      </div>
      <div className="d-flex">
        <strong>Email:</strong>
        <p className="ps-1">{store.user?.email}</p>
      </div>
    </main>
  );
};
