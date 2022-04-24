import React from "react";
import { Field, Form, Formik } from "formik";
import { TextField } from "./textField";

export const FilterUsersForm = ({ handleSubmit, error }) => (
  <Formik
    initialValues={{ userName: "", role: "Student" }}
    onSubmit={handleSubmit}
  >
    <Form className="inline-form mb-2">
      <TextField name="userName" label="Filtrar por nombre:" inline />

      <Field
        as="select"
        className="form-select"
        name="role"
        aria-label="filtrar por rol de usuario"
      >
        <option value="Student">Estudiantes</option>
        <option value="Teacher">Profesores</option>
      </Field>

      <button className="btn btn-primary" type="submit">
        Buscar
      </button>

      {error && <span className="text-danger">{error}</span>}
    </Form>
  </Formik>
);
