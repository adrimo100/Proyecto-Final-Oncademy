import React from "react";
import { Form, Formik } from "formik";
import { TextField } from "./textField";
import { SelectCourseField } from "./selectCourseField";

export const FilterSubjectsForm = ({ handleSubmit, error }) => {
  return (
    <Formik initialValues={{ name: "", course_id: "" }} onSubmit={handleSubmit}>
      <Form className="inline-form mb-2">
        <TextField name="name" label="Nombre:" inline />

        <SelectCourseField allOption />

        <button className="btn btn-primary" type="submit">
          Buscar
        </button>

        <button
          className="btn btn-success"
          type="submit"
          data-bs-target="#create-subject"
          data-bs-toggle="modal"
        >
          Nueva
        </button>

        {error && <span className="text-danger">{error}</span>}
      </Form>
    </Formik>
  );
};
