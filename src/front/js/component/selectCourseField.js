import { Field } from "formik";
import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

export const SelectCourseField = ({ allOption }) => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    if (!store.courses.length) {
      actions.getCourses();
    }
  }, []);
  
  return (
    <Field
      as="select"
      className="form-select"
      name="courseId"
      aria-label="filtrar por curso"
    >
      {allOption && <option value="">Todos</option>}
      {store.courses.map((course) => (
        <option key={course.id} value={course.id}>
          {course.name}
        </option>
      ))}
    </Field>
  );
}