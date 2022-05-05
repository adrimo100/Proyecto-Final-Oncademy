import { Modal } from "react-bootstrap";
import React from "react";
import { appFetch } from "../utils";
import { toast } from "react-toastify";

export const DeleteCourseModal = ({
  show,
  course,
  handleClose,
  handleChangedCourses,
}) => {
  async function deleteCourse() {
    try {
      const res = await appFetch(
        `/api/courses/${course.id}`,
        { method: "DELETE" },
        true
      );

      if (res.ok) {
        toast("Curso eliminado con éxito.", {
          type: "success",
        });
        handleChangedCourses();
        handleClose();
      } else {
        const body = await res.json();
        if (body.error) {
          return toast(body.error, { type: "error" });
        }
        throw new Error("Error al eliminar el curso.");
      }
    } catch (err) {
      toast("Error al eliminar la asignatura.", { type: "error" });
    }
  }

  return (
    course && (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación de eliminación</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            ¿Estás seguro de eliminar el curso "{course.name}"?
          </p>
          <span>Esta acción es irreversible.</span>
        </Modal.Body>

        <Modal.Footer>
          <button className="btn btn-primary" onClick={handleClose}>
            Cancelar
          </button>

          <button className="btn btn-danger" onClick={deleteCourse}>
            Eliminar
          </button>
        </Modal.Footer>
      </Modal>
    )
  );
};
