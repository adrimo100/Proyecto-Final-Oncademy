import React, { useContext } from "react";
import { Context } from "../store/appContext";

import { EditUser } from "./editUser";
import { SubjectCard } from "./subjectCard";

export const StudentDashboard = () => {
  const { store } = useContext(Context);

  const displaySubjects = () => {

    if (store.user?.subjects.length == 0)
      return (
        <div className="mt-4">
          <strong>
            <li>No Tienes Asignaturas</li>
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
              <SubjectCard
                key={index}
                subject={subject}
                dashboard={true}
              ></SubjectCard>
            ))}
          </div>
        </div>
      );
  };

  return (
    <main className="app-container py-4">
      <EditUser></EditUser>

      <div>
        <h2>Tus Asignaturas</h2>
        <div>{displaySubjects()}</div>
      </div>
    </main>
  );
};
