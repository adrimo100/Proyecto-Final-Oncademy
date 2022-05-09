import { Modal } from "react-bootstrap";
import React from "react";
import { appFetch } from "../utils";
import { toast } from "react-toastify";

export const DeleteSubjectModal = ({
  show,
  subject,
  handleClose,
  handleChangedSubjects,
}) => {
  async function deleteSubject() {
    try {
      const res = await appFetch(`/api/subjects/${subject.id}`, { method: "DELETE" }, true);
      
      if (res.ok) {
        toast("Asignatura eliminada con éxito.", {
          type: "success",
        });
        handleChangedSubjects();
        handleClose();
      } else {
        throw new Error("Error al eliminar la asignatura.");
      }
    } catch (err) {
      toast("Error al eliminar la asignatura.", { type: "error" });
    }
  }

  return subject && (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmación de eliminación</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          ¿Estás seguro de eliminar la asignatura "{subject.name}" del curso "
          {subject.course_name}"?
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
};
