import { Field } from "formik";
import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

export const SelectCourseField = ({ allOption, className = "", label }) => {
  const { store, actions } = useContext(Context);

  useEffect(() => {
    if (!store.courses.length) {
      actions.getCourses();
    }
  }, []);
  
  return (
    <>
      {label && (
        <label htmlFor="course_id" className={`form-label`}>
          {label}
        </label>
      )}
      <Field
        as="select"
        className={`form-select ${className}`}
        name="course_id"
        id="course_id"
        aria-label="filtrar por curso"
      >
        {allOption && <option value="">Todos los cursos</option>}
        {store.courses.map((course) => (
          <option key={course.id} value={+course.id}>
            {course.name}
          </option>
        ))}
      </Field>
    </>
  );
}