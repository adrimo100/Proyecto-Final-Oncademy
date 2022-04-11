import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

import { SubjectCard } from "../component/subjectCard";

export const TeacherDashboard = () => {
  const { store, actions } = useContext(Context);

  const displaySubjects = () => {
    if (store.user?.subjects.lenght == 0)
      return (
        <div className="mt-4">
          <strong>
            <li>No Tienes Asignaturas Asignadas</li>
          </strong>
        </div>
      );
    else
      return (
        <div className="mt-4">
          <div
            className="row mt-4 d-flex align-items-center"
            id="subjects-cards"
          >
            {store.user?.subjects.map((subject, index) => (
              <SubjectCard key={index} subject={subject}></SubjectCard>
            ))}
          </div>
        </div>
      );
  };

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

      <hr />

      <div>
        <h2>Tus Asignaturas Asignadas</h2>
        <div>{displaySubjects()}</div>
      </div>
    </main>
  );
};
