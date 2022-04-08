import React, { useState, useEffect } from "react";
import { getToken } from "../utils";
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

      const res = await fetch(
        process.env.BACKEND_URL + `/api/payments?${queryParameters.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
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

  function handleSubmit({ userName }) {
    setUserName((previousName) => {
      // If the userName has not changed we trigger a search manually
      // otherwise it will not be called because useEffect dependecies are the same
      if (previousName === userName) {
        getPayments();
      }
      return userName;
    });
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
