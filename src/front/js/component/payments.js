import React, { useState } from "react";
import { usePagination } from "../utils";
import "../../styles/payments.css";
import { Pagination } from "./pagination";
import { FilterPaymentsForm } from "./filterPaymentsForm";
import { AppTd } from "./AppTd";

export const Payments = () => {
  const [userName, setUserName] = useState(null);
  const [page, setPage] = useState(1);

  const {
    items: payments,
    total,
    pages,
    error,
  } = usePagination({ path: "/api/payments", parameters: { userName, page } });

  function handleSubmit({userName}) {
    setUserName(userName);
    setPage(1)
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
                  <AppTd>{payment.user}</AppTd>
                  <AppTd>
                    <div className="space-children">
                      {payment.subjects.map((subject) => (
                        <span className="payment-subject" key={subject}>
                          {subject}
                        </span>
                      ))}
                    </div>
                  </AppTd>
                  <AppTd>{payment.date}</AppTd>
                  <AppTd>{payment.quantity}</AppTd>
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
