import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { appFetch } from "../utils";
import { courseValidationSchema } from "../validation";
import { TextField } from "./textField";
import "../../styles/subjectModal.css";
import { toast } from "react-toastify";

export const CourseModal = ({
  course,
  setCourse,
  onChangedCourses,
  show,
  handleClose,
}) => {
  const updating = !!course;

  const [error, setError] = useState(null);

  function setFormValues() {
    return {
      name: course?.name || "",
      };
  }

  async function handleSubmit(values, { setFieldError }) {
    const path = updating ? `/api/courses/${course.id}` : "/api/courses";
    const method = updating ? "PUT" : "POST";
    setError(null);

    try {
      const res = await appFetch(path, { method, body: values }, true);
      const body = await res.json();

      if (!res.ok) {
        if (body.error) setError(body.error);

        if (body.validationErrors) {
          Object.entries(body.validationErrors).forEach(([key, value]) => {
            setFieldError(key, value);
          });
        }
      } else {
        toast(
          `Curso ${updating ? "actualizado" : "creado"} correctamente.`,
          { type: "success" }
        );
        updating && setCourse(body.course);
        onChangedCourses();
        handleClose();
      }
    } catch (err) {
      console.error(err);
      setError("Ha habido un error desconocido. Prueba más tarde.");
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{updating ? "Editando" : "Nuevo"} Curso</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={setFormValues()}
        validationSchema={courseValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setValues }) => {
          useEffect(() => {
            updating && setValues(setFormValues());
          }, [course]);

          return (
            <Form>
              <Modal.Body>
                <TextField name="name" label="Nombre" />

                <p>
                  Atención: Las asignaturas deben modificarse desde el panel de asignaturas.
                </p>
              </Modal.Body>

              <Modal.Footer className="subjects-modal-footer">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {updating ? "Editar" : "Crear"}
                </button>

                {error && <p className="w-100 py-2 text-danger">{error}</p>}
              </Modal.Footer>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};
