import React from "react";
import { Form, Formik } from "formik";
import { TextField } from "./textFIeld";
import { SelectCourseField } from "./selectCourseField";

export const FilterSubjectsForm = ({ handleSubmit, error }) => {
  return (
    <Formik initialValues={{ name: "", course_id: "" }} onSubmit={handleSubmit}>
      <Form className="inline-form mb-2">
        <TextField name="name" label="Filtrar por nombre:" inline />

        <SelectCourseField allOption />

        <button className="btn btn-primary" type="submit">
          Buscar
        </button>

        {error && <span className="text-danger">{error}</span>}
      </Form>
    </Formik>
  );
};
