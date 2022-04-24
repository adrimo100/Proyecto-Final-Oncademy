import { useField } from "formik";
import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

export const SelectCourseField = ({ allOption, className = "", label }) => {
  const { store: { courses }, actions } = useContext(Context);
  const lastCourseId = courses.slice(-1)[0]?.id
  const [field, meta, helpers] = useField("course_id");

  useEffect(() => {
    if (!courses.length) {
      actions.getCourses();
    }
  }, []);

  useEffect(() => {
    !allOption && helpers.setValue(lastCourseId)
  }, [lastCourseId])
  
  return (
    <>
      {label && (
        <label htmlFor="course_id" className={`form-label`}>
          {label}
        </label>
      )}
      <select
        as="select"
        className={`form-select ${className} ${meta.touched && meta.error && "border-danger"}`}
        name="course_id"
        id="course_id"
        aria-label="filtrar por curso"
        {...field}
      >
        {allOption && <option value="">Todos los cursos</option>}
        {courses.map((course) => (
          <option key={course.id} value={+course.id}>
            {course.name}
          </option>
        ))}
      </select>
    </>
  );
}