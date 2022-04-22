import React, { useContext, useEffect } from "react";
import { Field, Form, Formik } from "formik";
import { TextField } from "./textFIeld";
import { Context } from "../store/appContext";

export const FilterSubjectsForm = ({ handleSubmit, error }) => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    if (!store.courses.length) {
      actions.getCourses();
    }
  }, []);

  return (
    <Formik initialValues={{ name: "", courseId: "" }} onSubmit={handleSubmit}>
      <Form className="inline-form mb-2">
        <TextField name="name" label="Filtrar por nombre:" inline />

        <Field
          as="select"
          className="form-select"
          name="courseId"
          aria-label="filtrar por curso"
        >
          <option value="">
            Todos
          </option>
          {store.courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </Field>

        <button className="btn btn-primary" type="submit">
          Buscar
        </button>

        {error && <span className="text-danger">{error}</span>}
      </Form>
    </Formik>
  );
};
