import React, { useState } from "react";
import { usePagination } from "../utils";
import { FilterSubjectsForm } from "./filterSubjectsForm";
import { AppTd } from "./AppTd";
import { Pagination } from "./pagination";
import { SubjectModal } from "./subjectModal";
import { SubjectUsersModal } from "./subjectUsersModal";
import { DeleteSubjectModal } from "./deleteSubjectModal";

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

  const [watchedSubject, setWatchedSubject] = useState(null);
  function handleOpenModal(flagSetter, subject) {
    setWatchedSubject(subject);
    flagSetter(true);
  }
  function handleCloseModal(flagSetter) {
    flagSetter(false);
    setWatchedSubject(null);
  }

  const [showSubjectUsers, setShowSubjectUsers] = useState(false);
  const [showEditionModal, setShowEditionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <article>
      <FilterSubjectsForm
        handleSubmit={handleSubmit}
        error={error}
        onCreateSubject={() => handleOpenModal(setShowEditionModal, null)}
      />

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
                      onClick={() =>
                        handleOpenModal(setShowSubjectUsers, subject)
                      }
                    >
                      <i className="bi bi-people text-primary" />
                    </button>

                    <button
                      className="btn btn-sm"
                      aria-label="editar asignatura"
                      onClick={() =>
                        handleOpenModal(setShowEditionModal, subject)
                      }
                    >
                      <i className="bi bi-pencil text-primary" />
                    </button>

                    <button
                      className="btn btn-sm"
                      aria-label="eliminar asignatura"
                      onClick={() => handleOpenModal(setShowDeleteModal, subject)}
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
        show={showEditionModal}
        handleClose={() => handleCloseModal(setShowEditionModal)}
        subject={watchedSubject}
        setSubject={setWatchedSubject}
        onChangedSubjects={handleChangedSubjects}
      />

      <SubjectUsersModal
        subject={watchedSubject}
        show={showSubjectUsers}
        handleClose={() => handleCloseModal(setShowSubjectUsers)}
      />

      <DeleteSubjectModal
        subject={watchedSubject}
        show={showDeleteModal}
        handleClose={() => handleCloseModal(setShowDeleteModal)}
        handleChangedSubjects={handleChangedSubjects}
      />
    </article>
  );
};
