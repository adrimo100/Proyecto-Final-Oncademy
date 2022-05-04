import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { appFetch } from "../utils";
import { subjectValidationSchema } from "../validation";
import { RichTextField } from "./richTextField";
import { SelectCourseField } from "./selectCourseField";
import { TextField } from "./textField";
import "../../styles/subjectModal.css";

export const SubjectModal = ({
  subject,
  setSubject,
  onChangedSubjects,
  show,
  handleClose,
}) => {
  const updating = !!subject;

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function setFormValues() {
    return {
      name: subject?.name || "",
      description: subject?.description || "",
      cardDescription: subject?.cardDescription || "",
      image_url: subject?.image_url || "",
      start_date: subject?.start_date || "",
      end_date: subject?.end_date || "",
      course_id: subject?.course_id || "",
      stripe_id: subject?.stripe_id || "",
    };
  }

  async function handleSubmit(values, { setFieldError }) {
    const path = updating ? `/api/subjects/${subject.id}` : "/api/subjects";
    const method = updating ? "PUT" : "POST";
    setSuccess(false);
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
        setSuccess(true);
        updating && setSubject(body.subject);
        onChangedSubjects();
      }
    } catch (err) {
      console.error(err);
      setError("Ha habido un error desconocido. Prueba más tarde.");
    }
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{updating ? "Editando" : "Nueva"} Asignatura</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={setFormValues()}
        validationSchema={subjectValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setValues }) => {
          useEffect(() => {
            updating && setValues(setFormValues());
          }, [subject]);

          return (
            <Form>
              <Modal.Body>
                <TextField name="name" label="Nombre" />
                <RichTextField
                  name="description"
                  label="Descripción en detalles"
                />
                <TextField
                  name="cardDescription"
                  label="Descripción en carta"
                />
                <TextField name="image_url" label="URL de imágen" />
                <TextField
                  name="start_date"
                  label="Fecha de inicio (dd/mm/aa)"
                />
                <TextField name="end_date" label="Fecha de fin (dd/mm/aa)" />
                <SelectCourseField className="mb-3" label="Curso" />
                <TextField name="stripe_id" label="Id de stripe" />
              </Modal.Body>

              <Modal.Footer className="subjects-modal-footer">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {updating ? "Editar" : "Crear"}
                </button>

                <p className="w-100 py-2">
                  {success && (
                    <span className="text-success">
                      Asignatura {updating ? "actualizada" : "creada"}{" "}
                      correctamente.
                    </span>
                  )}

                  {error && <span className="text-danger">{error}</span>}
                </p>
              </Modal.Footer>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
};
