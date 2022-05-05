import React, { useState } from "react";
import { usePagination } from "../utils";
import { Pagination } from "./pagination";
import { AppTd } from "./AppTd";
import { FilterCousesForm } from "./filterCoursesForm";
import { CourseModal } from "./courseModal";

export const CoursesSection = () => {
  const [name, setName] = useState(null);
  const [page, setPage] = useState(1);

  const {
    items: courses,
    total,
    pages,
    error,
    refetch,
  } = usePagination({ path: "/api/courses", parameters: { name, page } });

  function handleSubmit({ name }) {
    setName(name);
    setPage(1);
  }

  function handleChangedCourses() {
    refetch();
  }

  const [watchedCourse, setWatchedCourse] = useState(null);
  function handleOpenModal(flagSetter, course) {
    setWatchedCourse(course);
    flagSetter(true);
  }
  function handleCloseModal(flagSetter) {
    flagSetter(false);
    setWatchedCourse(null);
  }

  const [showEditionModal, setShowEditionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <article>
      <FilterCousesForm
        handleSubmit={handleSubmit}
        error={error}
        onCreateCourse={() => handleOpenModal(setShowEditionModal, null)}
      />

      {!courses.length && !error && <p>No se han encontrado cursos.</p>}
      {courses.length > 0 && (
        <div className="table-responsive-sm">
          <table className="table table-hover caption-top">
            <caption>
              Mostrando {courses.length} de {total} cursos.
            </caption>
            <thead>
              <tr>
                <th scope="col">Curso</th>
                <th scope="col">Asignaturas</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <AppTd>{course.name}</AppTd>
                  <AppTd className="justify-content-between">
                    <div className="space-children">
                      {course.subjects.map((subject) => (
                        <span className="d-block" key={subject.id}>
                          {subject.name}
                        </span>
                      ))}
                    </div>
                  </AppTd>
                  <AppTd>
                    <button
                      className="btn btn-sm"
                      aria-label="editar curso"
                      onClick={() =>
                        handleOpenModal(setShowEditionModal, course)
                      }
                    >
                      <i className="bi bi-pencil text-primary" />
                    </button>

                    <button
                      className="btn btn-sm"
                      aria-label="eliminar curso"
                      onClick={() =>
                        handleOpenModal(setShowDeleteModal, course)
                      }
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

      <CourseModal
        show={showEditionModal}
        handleClose={() => handleCloseModal(setShowEditionModal)}
        course={watchedCourse}
        setCourse={setWatchedCourse}
        onChangedCourses={handleChangedCourses}
      />
    </article>
  );
};
