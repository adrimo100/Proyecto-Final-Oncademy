import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { appFetch } from "../utils";
import { subjectValidationSchema } from "../validation";
import { SelectCourseField } from "./selectCourseField";
import { TextField } from "./textFIeld";

export const SubjectModal = ({ subjectId = null, variant = "update" }) => {
  const updating = variant == "update";

  // Operation status state
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Get subject information if we are updating
  const [subject, setSubject] = useState(null);
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

    updating && subjectId && fetchSubject();
  }, [subjectId]);

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
    const path = updating ? `/api/subjects/${subjectId}` : "/api/subjects";
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
      }
    } catch (err) {
      console.error(err);
      setError("Ha habido un error desconocido. Prueba más tarde.");
    }
  }

  return (
    <div
      id={`${updating ? "update" : "create"}-subject`}
      className="modal fade"
      tabIndex="-1"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-3">
              {updating ? "Editando" : "Nueva"} Asignatura
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
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
                      {updating ? "Editar" : "Crear"}
                    </button>
                    {success && (
                      <p className="text-success">
                        Asignatura {updating ? "actualizada" : "creada"}{" "}
                        correctamente.
                      </p>
                    )}
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};
