import React, { useState } from "react";
import { usePagination } from "../utils";
import { Pagination } from "./pagination";
import { AppTd } from "./AppTd";
import { FilterCousesForm } from "./filterCoursesForm";

export const CoursesSection = () => {
  const [name, setName] = useState(null);
  const [page, setPage] = useState(1);

  const {
    items: courses,
    total,
    pages,
    error,
  } = usePagination({ path: "/api/courses", parameters: { name, page } });

  function handleSubmit({ name }) {
    setName(name);
    setPage(1);
  }

  return (
    <article>
      <FilterCousesForm handleSubmit={handleSubmit} error={error} />

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
                <th scope="col">
                  Acciones
                </th>
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
                          {subject.name} ({subject.course_name})
                        </span>
                      ))}
                    </div>
                  </AppTd>
                  <AppTd>...</AppTd>
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
    </article>
  );
};
