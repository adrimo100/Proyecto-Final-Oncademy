import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { appFetch, usePagination } from "../utils";

export const EditUserSubjectsModal = ({
  user,
  onUpdatedUser,
  show,
  handleClose,
}) => {
  // Parse user subjects
  const userSubjects =
    user?.subjects.map((subject) => ({
      id: subject.id,
      name: `${subject.name} (${subject.course_name})`,
    })) || [];

  // Fetch all subjects using an infinite scrolling list
  const [subjects, setSubjects] = useState([]);
  const [page, setPage] = useState(1);
  const { items, pages } = usePagination({
    path: "/api/subjects",
    parameters: { page },
  });

  useEffect(() => {
    // Parse subjects names
    const newSubjects = items.map((subject) => ({
      id: subject.id,
      name: `${subject.name} (${subject.course_name})`,
    }));

    setSubjects([...subjects, ...newSubjects]);
  }, [items]);

  const [assignableSubjects, setAssignableSubjects] = useState([]);
  useEffect(() => {
    setAssignableSubjects(
      subjects.filter((subject) => {
        return !userSubjects.find(
          (userSubject) => userSubject.id === subject.id
        );
      })
    );
  }, [userSubjects, subjects]);

  async function addSubject(subjectId) {
    try {
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
        onUpdatedUser(body.user);
      } else {
        throw new Error();
      }
    } catch (error) {
      toast("Error asignando la asignatura.", {
        type: "error",
      });
    }
  }

  async function removeSubject(subjectId) {
    try {
     const res = await appFetch(
       `/api/users/${user.id}/subjects/${subjectId}`,
       { method: "DELETE" },
       true
     );

     if (res.ok) {
       const body = await res.json();
       onUpdatedUser(body.user);
     } else {
       throw new Error()
     } 
    } catch (error) {
      toast("Error al eliminar la asignatura.", {
        type: "error",
      });
    }
  }

  return (
    user && (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editando Asignaturas de {user.full_name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
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
            {page < pages && (
              <button
                className="btn btn-link mt-1"
                onClick={() => setPage(page + 1)}
              >
                Mostrar más
              </button>
            )}
          </article>
        </Modal.Body>
      </Modal>
    )
  );
};
