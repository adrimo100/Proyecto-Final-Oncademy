import React, { useEffect, useState } from "react";
import { appFetch } from "../utils";

export const EditSubjectsModal = ({ user, setEditedUser }) => {
  const userSubjects = user?.subjects.map((subject) => ({
    id: subject.id,
    name: `${subject.name} (${subject.course_name})`,
  }));

  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const res = await appFetch("/api/subjects");
      if (res.ok) {
        const body = await res.json();

        // Parse subjects names
        const subjects = body.subjects.map((subject) => ({
          id: subject.id,
          name: `${subject.name} (${subject.course})`,
        }));

        setSubjects(subjects);
      }
    }
    fetchData();
  }, []);

  const [assignableSubjects, setAssignableSubjects] = useState([]);
  useEffect(() => {
    setAssignableSubjects(
      subjects.filter((subject) => {
        return !userSubjects.find(
          (userSubject) => userSubject.id === subject.id
        );
      })
    );
  }, [userSubjects]);

  async function addSubject(subjectId) {
    const res = await appFetch(
      `/api/users/${user.id}/subjects`,
      {
        method: "POST",
        body: { subjects: [subjectId] },
      },
      true
    );

    if (res.ok) {
      const body = await res.json();
      setEditedUser(body.user);
    }
  }

  async function removeSubject(subjectId) {
    const res = await appFetch(
      `/api/users/${user.id}/subjects/${subjectId}`,
      { method: "DELETE" },
      true
    );

    if (res.ok) {
      const body = await res.json();
      setEditedUser(body.user);
    }
  }

  return (
    <div id="edit-subjects" className="modal fade" tabIndex="-1">
      <div className="modal-dialog">
        {user && (
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-3">
                Editando Asignaturas de {user.full_name}
              </h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <article className="mb-3">
                <h3 className="fs-4">Asignadas</h3>
                <ul className="list-group">
                  {!userSubjects.length && (
                    <p>{user.full_name} no tiene asignaturas asignadas.</p>
                  )}
                  {userSubjects.map((subject) => (
                    <li
                      key={subject.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {subject.name}
                      <button
                        className="btn"
                        onClick={() => removeSubject(subject.id)}
                        aria-label="Eliminar asignatura"
                      >
                        <i className="bi bi-trash-fill text-danger" />
                      </button>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="mb-3">
                <h3 className="fs-4">Añadir asignaturas</h3>
                <ul className="list-group">
                  {!assignableSubjects.length && (
                    <p>No hay asignaturas disponibles.</p>
                  )}
                  {assignableSubjects.map((subject) => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center"
                      key={subject.id}
                    >
                      {subject.name}
                      <button
                        className="btn"
                        onClick={() => addSubject(subject.id)}
                        aria-label="Añadir asignatura"
                      >
                        <i className="bi bi-plus-circle-fill text-success" />
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
