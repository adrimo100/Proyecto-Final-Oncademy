import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { appFetch } from "../utils";
import { subjectValidationSchema } from "../validation";
import { SelectCourseField } from "./selectCourseField";
import { TextField } from "./textFIeld";

export const UpdateSubjectModal = ({ subjectId }) => {
  const [subject, setSubject] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchSubject() {
      const res = await appFetch(`/api/Subjects/${subjectId}`);

      if (res.ok) {
        const body = await res.json();
        setSubject(body);
      } else {
        setError("Error obteniendo los detalles de la asignatura.");
      }
    }

    subjectId && fetchSubject();
  }, [subjectId]);

  async function handleSubmit(values, { setFieldError }) {
    try {
      setSuccess(false);
      setError(null);

      const res = await appFetch(
        `/api/subjects/${subjectId}`,
        {
          method: "PUT",
          body: values,
        },
        true
      );
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
        setSubject(body.subject);
      }
    } catch (err) {
      console.error(err);
      setError(
        "Ha habido un error desconocido al actualizar la asignatura. Prueba más tarde."
      );
    }
  }

  return (
    <div id="update-subject" className="modal fade" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-3">Editando Asignatura</h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            {!subject && error && <p className="text-danger">{error}</p>}

            {subject && (
              <Formik
                initialValues={{
                  name: subject.name || "",
                  description: subject.description || "",
                  cardDescription: subject.cardDescription || "",
                  image_url: subject.image_url || "",
                  start_date: subject.start_date || "",
                  end_date: subject.end_date || "",
                  course_id: subject.course_id || "",
                  stripe_id: subject.stripe_id || "",
                }}
                validationSchema={subjectValidationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => {
                  return (
                    <Form>
                      <TextField name="name" label="Nombre" />
                      <TextField
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
                      <TextField
                        name="end_date"
                        label="Fecha de fin (dd/mm/aa)"
                      />
                      <SelectCourseField className="mb-3" label="Curso" />
                      <TextField name="stripe_id" label="Id de stripe" />

                      <button
                        className="btn btn-primary mb-3"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        Editar
                      </button>

                      {success && (
                        <p className="text-success">
                          Asignatura actualizada correctamente.
                        </p>
                      )}
                      {error && <p className="text-danger">{error}</p>}
                    </Form>
                  );
                }}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
