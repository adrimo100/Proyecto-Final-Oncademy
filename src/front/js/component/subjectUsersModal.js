import React from "react";
import { Modal } from "react-bootstrap";

export const SubjectUsersModal = ({ subject, show, handleClose }) => {
  const teachers = subject?.users.filter((user) => user.role === "Teacher") || [];
  const students = subject?.users.filter((user) => user.role === "Student") || [];

  return subject && (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Usuarios de {subject?.name}{" "}
          <span className="text-secondary">({subject?.course_name})</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
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
      </Modal.Body>
    </Modal>
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
