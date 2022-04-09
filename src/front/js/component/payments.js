import React, { useState, useEffect } from "react";
import { appFetch } from "../utils";
import "../../styles/payments.css";
import { Pagination } from "./pagination";
import { Field, Form, Formik } from "formik";

export const Payments = () => {
  const [userName, setUserName] = useState(null);
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  async function getPayments() {
    try {
      const queryParameters =
        "page=" + page + (userName ? `&userName=${userName}` : "");

      const res = await appFetch(
        "/api/payments?" + queryParameters,
        null,
        true
      );
      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error);
      }
      setPayments(body.payments);
      setTotal(body.total);
      setPages(body.pages);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getPayments();
  }, [page, userName]);

  function handleSubmit(values) {
    const previousName = userName;
    const nextName = values.userName;

    if (previousName === nextName) {
      // useEffect wont be triggered if the name is the same
      getPayments();
    } else {
      setPage(1);
    }

    setUserName(nextName);
  }

  return (
    <article>
      <h2>Pagos</h2>

      <Formik initialValues={{ userName: "" }} onSubmit={handleSubmit}>
        <Form className="payments-form mb-2">
          <Field name="userName">
            {({ field }) => (
              <>
                <label htmlFor="userName" className="form-label mb-0">
                  Filtrar por nombre:
                </label>
                <input
                  id="userName"
                  className="form-control"
                  type="text"
                  placeholder="Jhon Doe"
                  {...field}
                />
              </>
            )}
          </Field>
          <button className="btn btn-primary" type="submit">
            Buscar
          </button>
        </Form>
      </Formik>

      {!payments.length && <p>No se han encontrado pagos.</p>}
      {payments.length > 0 && (
        <div className="table-responsive-sm">
          <table className="table table-hover caption-top">
            <caption>
              Mostrando {payments.length} de {total} pagos.
            </caption>
            <thead>
              <tr>
                <th scope="col">Estudiante</th>
                <th scope="col">Asignaturas</th>
                <th scope="col">Fecha</th>
                <th scope="col">Cantidad</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.user}</td>
                  <td>
                    {payment.subjects.map((subject) => (
                      <span className="payment-subject" key={subject}>
                        {subject}
                      </span>
                    ))}
                  </td>
                  <td>{payment.date}</td>
                  <td>{payment.quantity}</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan={4}>
                  <Pagination {...{ page, pages, setPage }} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </article>
  );
};
