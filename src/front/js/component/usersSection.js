import React, { useState } from "react";
import { usePagination } from "../utils";
import { AppTd } from "./AppTd";
import { FilterUsersForm } from "./filterUsersForm";
import { Pagination } from "./pagination";

export const UsersSection = () => {
  const [filters, setFilters] = useState({
    userName: null,
    role: "Student",
  });

  const [page, setPage] = useState(1);

  const {
    items: users,
    total,
    pages,
    error,
  } = usePagination({
    path: "/api/users",
    parameters: { ...filters, page },
  });

  function handleSubmit(values) {
    setFilters({
      userName: values.userName,
      role: values.role,
    });
    setPage(1);
  }

  return (
    <article>
      <h2>Usuarios</h2>

      <FilterUsersForm handleSubmit={handleSubmit} error={error} />

      {users.length > 0 && (
        <div className="table-responsive-sm">
          <table className="table table-hover caption-top">
            <caption>
              Mostrando {users.length} de {total} usuarios.
            </caption>
            <thead>
              <tr>
                <th scope="col">Usuario</th>
                <th scope="col">Asignaturas</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <AppTd>{user.full_name}</AppTd>
                  <AppTd className="justify-content-between">
                    <div className="space-children">
                      {user.subjects.map((subject) => (
                        <span className="d-block" key={subject.id}>
                          {subject.name} ({subject.course_name})
                        </span>
                      ))}
                    </div>

                    <div>
                      <button className="btn btn-outline-primary btn-sm">
                        <i className="bi bi-pencil" />
                      </button>
                    </div>
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
    </article>
  );
};
