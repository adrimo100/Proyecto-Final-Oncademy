import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

import { SubjectCard } from "../component/subjectCard";
import { validateYupSchema } from "formik";
import { EditUser } from "./editUser";

export const TeacherDashboard = () => {
  const { store, actions } = useContext(Context);

  const displaySubjects = () => {
    if (store.user?.subjects.length == 0)
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
      <EditUser></EditUser>

      <div>
        <h2>Tus Asignaturas Asignadas</h2>
        <div>{displaySubjects()}</div>
      </div>
    </main>
  );
};
