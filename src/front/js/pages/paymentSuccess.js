import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { Link } from "react-router-dom";

import "../../styles/paymentSuccess.css";
import { Context } from "../store/appContext";

export const PaymentSuccess = () => {
  const params = useParams();

  const { store, actions } = useContext(Context);

  const [subject, setSubject] = useState(null);
  const [paymentDone, setPaymentDone] = useState("Loading");

  useEffect(() => {
    fetch(process.env.BACKEND_URL + `/api/Subjects/${params.subject_id}`)
      .then((response) => {
        if (!response.ok) throw new Error("La asignatura no existe");

        return response.json();
      })
      .then((data) => setSubject(data))
      .catch((error) => console.log(error));

    if (!actions.checkSubscription(params.subject_id)) setPaymentDone(false);
    else setPaymentDone(true);
  }, []);

  const displayInfo = () => {
    switch (paymentDone) {
      case "Loading":
        return (
          <div className="spinner-border text-white" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        );

      case true:
        return (
          <div className="text-center text-white">
            <h3>Subscripción realizada con éxito</h3>
            <br />
            <h3>¡¡¡Bienvenido/a a {subject ? subject.name : ""}!!!</h3>

            <Link to="/">
              <button className="btn btn-primary mt-5">Volver al Home</button>
            </Link>
          </div>
        );

      case false:
        return (
          <div className="text-center text-white">
            <h3>Subscripción rechazada, vuelva a intentarlo</h3>
            <br />
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-emoji-frown-fill text-center"
                viewBox="0 0 16 16"
              >
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm-2.715 5.933a.5.5 0 0 1-.183-.683A4.498 4.498 0 0 1 8 9.5a4.5 4.5 0 0 1 3.898 2.25.5.5 0 0 1-.866.5A3.498 3.498 0 0 0 8 10.5a3.498 3.498 0 0 0-3.032 1.75.5.5 0 0 1-.683.183zM10 8c-.552 0-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5S10.552 8 10 8z" />
              </svg>
            </div>

            <Link to={`/subject/${subject ? subject.id : ""}`}>
              <button className="btn btn-primary mt-5">
                Volver a la asignatura
              </button>
            </Link>
          </div>
        );
    }
  };

  return (
    <div
      className="container-fluid d-absolute"
      style={{ position: "absolute", height: "76vh" }}
    >
      <div
        className="row h-100 d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: "rgb(255, 168, 0)",
        }}
      >
        <div className="col-4 d-none d-md-block"></div>
        <div
          className="col-12 col-md-4 text-white d-flex justify-content-center align-items-center"
          id="payment-status-section"
        >
          {displayInfo()}
        </div>
        <div className="col-4 d-none d-md-block"></div>
      </div>
    </div>
  );
};
