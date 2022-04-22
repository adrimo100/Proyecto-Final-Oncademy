import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { appFetch } from "../utils";
import { subjectValidationSchema } from "../validation"
import { SelectCourseField } from "./selectCourseField";
import { TextField } from "./textFIeld";

export const UpdateSubjectModal = ({ subjectId }) => {
  const [subject, setSubject] = useState(null);
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchSubject() {
      const res = await appFetch(`/api/Subjects/${subjectId}`);
      
      if (res.ok) {
        const body = await res.json()
        setSubject(body)
      } else {
        setError("Error obteniendo los detalles de la asignatura.")
      }
    }

    subjectId && fetchSubject()
  }, [subjectId])

  async function handleSubmit(values) {

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
                initialState={{
                  name: "",
                  description: "",
                  cardDescription: "",
                  image_url: "",
                  start_date: "",
                  end_date: "",
                  course_id: "",
                  stripe_id: "",
                }}
                validationSchema={subjectValidationSchema}
                handleSubmit={handleSubmit}
              >
                {({ isSubmitting, setValues }) => {
                  useEffect(() => {
                    setValues(subject)
                  }, [subject])
                  
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
                    <TextField name="stripe_id" label="Id de stripe"/>

                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Editar
                    </button>

                    {error && <span className="text-danger">{error}</span>}
                  </Form>
                )}}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
