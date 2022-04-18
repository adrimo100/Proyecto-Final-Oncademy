import React from "react";
import { Field, Form, Formik } from "formik";


export const FilterByNameForm = ({
  filterKey = "userName",
  placeholder = "Pepe",
  handleSubmit,
  error,
}) => (
  <Formik initialValues={{ [filterKey]: "" }} onSubmit={handleSubmit}>
    <Form className="payments-form mb-2">
      <Field name={filterKey}>
        {({ field }) => (
          <>
            <label htmlFor={filterKey} className="form-label mb-0">
              Filtrar por nombre:
            </label>
            <input
              id={filterKey}
              className="form-control"
              type="text"
              placeholder={placeholder}
              {...field}
            />
          </>
        )}
      </Field>

      <button className="btn btn-primary" type="submit">
        Buscar
      </button>

      {error && <span className="text-danger">{error}</span>}
    </Form>
  </Formik>
);