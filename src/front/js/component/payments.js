import React, { useState, useEffect } from "react";
import { appFetch } from "../utils";
import "../../styles/payments.css";
import { Pagination } from "./pagination";
import { FilterPaymentsForm } from "./filterPaymentsForm";

export const Payments = () => {
  const [userName, setUserName] = useState(null);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  async function getPayments() {
    try {
      setError(null)

      const queryParameters =
        "page=" + page + (userName ? `&userName=${userName}` : "");

      const res = await appFetch(
        "/api/payments?" + queryParameters,
        null,
        true
      );
      const body = await res.json();

      if (!res.ok) {
        if (body.error) return setError(body.error);
        throw new Error();
      }
      setPayments(body.payments);
      setTotal(body.total);
      setPages(body.pages);
    } catch (error) {
      console.error(error);
      setError("No se ha podido conectar con el servidor, prueba más tarde.");
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

      <FilterPaymentsForm handleSubmit={handleSubmit} error={error} />

      {!payments.length && !error && <p>No se han encontrado pagos.</p>}
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
                  <td className="space-children">
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
