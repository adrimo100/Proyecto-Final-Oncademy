import React from "react";

export const SubjectUsersModal = ({ subject }) => {
  const teachers = subject?.users.filter((user) => user.role === "Teacher");
  const students = subject?.users.filter((user) => user.role === "Student");

  return (
    <div id="subject-users" className="modal fade" tabIndex="-1">
      <div className="modal-dialog">
        {subject && (
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-3">
                Usuarios de {subject.name}{" "}
                <span className="text-secondary">({subject.course_name})</span>
              </h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              <h3 className="fs-5">Profesores</h3>
              {teachers.length ? (
                <UserList users={teachers} />
              ) : (
                <p>No hay profesores.</p>
              )}
              <h3 className="fs-5">Alumnos</h3>
              {students.length ? (
                <UserList users={students} />
              ) : (
                <p>No hay alumnos.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const UserList = ({ users }) => (
  <ul className="list-group my-2">
    {users.map((user) => (
      <li
        key={user.full_name}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        {user.full_name}
      </li>
    ))}
  </ul>
);