import React, { useState } from "react";
import { usePagination } from "../utils";
import { AppTd } from "./AppTd";
import { EditUserSubjectsModal } from "./editUserSubjectsModal";
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
    refetch
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

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);

  function openUpdateModal(user) {
    setUpdatedUser(user);
    setShowUpdateModal(true);
  }
  function closeUpdateModal() {
    setUpdatedUser(null);
    setShowUpdateModal(false);
  }
  
  function handleUpdatedUser(user) {
    setUpdatedUser(user);
    refetch()
  }

  const selectedUserRole = filters.role === "Student" ? "Estudiantes" : "Profesores";

  return (
    <article>
      <FilterUsersForm handleSubmit={handleSubmit} error={error} />

      {!users.length && !error && <p>No se han encontrado usuarios.</p>}

      {users.length > 0 && (
        <div className="table-responsive-sm">
          <table className="table table-hover caption-top">
            <caption>
              Mostrando {users.length} de {total} usuarios.
            </caption>
            <thead>
              <tr>
                <th scope="col">{selectedUserRole}</th>
                <th scope="col">Email</th>
                <th scope="col">Asignaturas</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <AppTd>{user.full_name}</AppTd>
                  <AppTd>{user.email}</AppTd>
                  <AppTd className="justify-content-between">
                    <div className="space-children">
                      {user.subjects.map((subject) => (
                        <span className="d-block" key={subject.id}>
                          {subject.name} ({subject.course_name})
                        </span>
                      ))}
                    </div>

                    <div>
                      <button
                        className="btn"
                        aria-label="editar asignaturas"
                        onClick={() => openUpdateModal(user)}
                      >
                        <i className="bi bi-pencil text-primary" />
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

      <EditUserSubjectsModal
        show={showUpdateModal}
        handleClose={closeUpdateModal}
        user={updatedUser}
        onUpdatedUser={handleUpdatedUser}
      />
    </article>
  );
};
