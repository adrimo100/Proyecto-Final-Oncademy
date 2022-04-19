import React, { useEffect, useState } from "react";
import { appFetch } from "../utils";
import { FilterUsersForm } from "./filterUsersForm";
import { Pagination } from "./pagination";

export const UserList = () => {
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(0)
  const [error, setError] = useState(null);

  async function handleSubmit({ userName, role = "Student" }) {
    try {
      setError(null);
      const res = await appFetch(
        `/api/users?role=${role}${userName ? `&userName=${userName}` : ""}`,
        null,
        true
      );
      const body = await res.json();

      if (!res.ok) {
        throw new Error(
          body.error ||
            "No se ha podido conectar con el servidor, prueba más tarde."
        );
      }

      setUsers(body.users);
      setTotal(body.total);
      setPages(body.pages);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  }

  useEffect(() => {
    handleSubmit({ userName: null});
  }, [])

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
                  <td>{user.full_name}</td>
                  <td className="space-children">
                    {user.subjects.map((subject) => (
                      <span className="d-block" key={subject.id}>
                        {subject.name} ({subject.course_name})
                      </span>
                    ))}
                  </td>
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
