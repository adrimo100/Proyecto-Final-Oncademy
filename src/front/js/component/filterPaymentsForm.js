import React from "react";
import { Form, Formik } from "formik";
import { TextField } from "./textField";

export const FilterPaymentsForm = ({ handleSubmit, error }) => (
  <Formik initialValues={{ userName: "" }} onSubmit={handleSubmit}>
    <Form className="inline-form mb-2">
      <TextField
        name="userName"
        label="Filtrar por nombre:"
        inline
      />
     
      <button className="btn btn-primary" type="submit">
        Buscar
      </button>

      {error && <span className="text-danger">{error}</span>}
    </Form>
  </Formik>
);