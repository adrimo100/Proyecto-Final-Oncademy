import { Modal } from "react-bootstrap";
import React from "react";
import { appFetch } from "../utils";

export const DeleteSubjectModal = ({ show, subject, handleClose, handleChangedSubjects }) => {

  async function deleteSubject() {
    await appFetch(`/api/subjects/${subject.id}`, { method: "DELETE" }, true);
    handleChangedSubjects();
    handleClose();
  }
  
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmación de eliminación</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          ¿Estás seguro de eliminar la asignatura "{subject?.name}" del curso "
          {subject?.course_name}"?
        </p>
        <span>Esta acción es irreversible.</span>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-primary" onClick={handleClose}>
          Cancelar
        </button>

        <button className="btn btn-danger" onClick={deleteSubject}>
          Eliminar
        </button>
      </Modal.Footer>
    </Modal>
  );
}