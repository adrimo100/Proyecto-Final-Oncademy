import React from "react";
import { Form, Formik } from "formik";
import { TextField } from "./textField";

export const FilterCousesForm = ({ handleSubmit, error }) => (
  <Formik initialValues={{ name: "" }} onSubmit={handleSubmit}>
    <Form className="inline-form mb-2">
      <TextField name="name" label="Filtrar por nombre:" inline />

      <button className="btn btn-primary" type="submit">
        Buscar
      </button>

      {error && <span className="text-danger">{error}</span>}
    </Form>
  </Formik>
);
