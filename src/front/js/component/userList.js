import React, { useEffect, useState } from "react";
import { appFetch } from "../utils";
import { FilterUsersForm } from "./filterUsersForm";
import { Pagination } from "./pagination";

export const UserList = () => {
  const [userName, setUserName] = useState(null);
  const [role, setRole] = useState("Student");
  const [page, setPage] = useState(1);

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [error, setError] = useState(null);

  async function getUsers() {
    try {
      setError(null);

      const params = new URLSearchParams();
      userName && params.set("userName", userName);
      params.set("role", role);
      params.set("page", page);
      
      const res = await appFetch(
        "/api/users?" + params.toString(),
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

  function handleSubmit(values) {
    setPage(1);
    setUserName(values.userName);
    setRole(values.role);
  }

  useEffect(() => {
    getUsers()
  }, [page, userName, role]);

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
