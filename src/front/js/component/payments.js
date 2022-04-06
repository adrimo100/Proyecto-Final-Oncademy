import React, { useState, useEffect } from "react";
import { getToken } from "../utils";

export const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage, setPerPage] = useState(10);

  async function getPayments(userName) {
    try {
      const queryParameters = `${
        userName ? `userName=${userName}` : ""
      }&page=${page}&perPage=${perPage}`;

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
      const { payments, totalResults, totalPages } = body;
      setPayments(payments);
      setTotalResults(totalResults);
      setTotalPages(totalPages);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getPayments();
  }, []);

  return (
    <article>
      <h2>Pagos</h2>

      <div className="table-responsive-sm">
        <table class="table">
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
                <td>{payment.subjects.map((subject) => subject).join(", ")}</td>
                <td>{payment.date}</td>
                <td>{payment.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};
