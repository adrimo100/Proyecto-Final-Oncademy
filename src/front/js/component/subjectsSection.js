import React, { useState } from "react";
import { appFetch, usePagination } from "../utils";
import { FilterSubjectsForm } from "./filterSubjectsForm";
import { AppTd } from "./AppTd";
import { Pagination } from "./pagination";
import { SubjectModal } from "./subjectModal";
import { SubjectUsersModal } from "./subjectUsersModal";

export const SubjectsSection = () => {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const {
    items: subjects,
    error,
    pages,
    total,
    refetch,
  } = usePagination({
    path: "/api/subjects",
    parameters: { ...filters, page },
  });

  function handleSubmit(filters) {
    setFilters(filters);
  }

  function handleChangedSubjects() {
    refetch();
  }

  async function deleteSubject(id) {
    await appFetch(`/api/subjects/${id}`, { method: "DELETE" }, true);
    handleChangedSubjects();
  }

  const [editedSubjectId, setEditedSubjectId] = useState(null);

  const [watchedSubject, setWatchedSubject] = useState(null);
  function handleOpenModal(flagSetter, subject) {
    setWatchedSubject(subject);
    flagSetter(true);
  }
  function handleCloseModal(flagSetter) {
    flagSetter(false);
    setWatchedSubject(null);
  }

  const [showUsers, setShowUsers] = useState(false);

  return (
    <article>
      <FilterSubjectsForm handleSubmit={handleSubmit} error={error} />

      {!subjects.length && !error && <p>No se han encontrado asignaturas.</p>}

      {subjects.length > 0 && (
        <div className="table-responsive-sm">
          <table className="table table-hover caption-top">
            <caption>
              Mostrando {subjects.length} de {total} asignaturas.
            </caption>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Curso</th>
                <th scope="col">Inicio</th>
                <th scope="col">Fin</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <AppTd>{subject.name}</AppTd>
                  <AppTd>{subject.course_name}</AppTd>
                  <AppTd>{subject.start_date}</AppTd>
                  <AppTd>{subject.end_date}</AppTd>

                  <AppTd>
                    <button
                      className="btn btn-sm"
                      aria-label="ver usuarios de asignatura"
                      onClick={() => handleOpenModal(setShowUsers, subject)}
                    >
                      <i className="bi bi-people text-primary" />
                    </button>

                    <button
                      className="btn btn-sm"
                      aria-label="editar asignatura"
                      data-bs-toggle="modal"
                      data-bs-target="#update-subject"
                      onClick={() => setEditedSubjectId(subject.id)}
                    >
                      <i className="bi bi-pencil text-primary" />
                    </button>
                    <button
                      className="btn btn-sm"
                      aria-label="eliminar asignatura"
                      onClick={() => deleteSubject(subject.id)}
                    >
                      <i className="bi bi-trash-fill text-danger" />
                    </button>
                  </AppTd>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan={4}>
                  <Pagination {...{ page, pages, setPage }} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <SubjectModal
        subjectId={editedSubjectId}
        variant="update"
        onChangedSubjects={handleChangedSubjects}
      />
      <SubjectModal
        variant="create"
        onChangedSubjects={handleChangedSubjects}
      />
      {
        <SubjectUsersModal
          subject={watchedSubject}
          show={showUsers}
          handleClose={() => handleCloseModal(setShowUsers)}
        />
      }
    </article>
  );
};
