import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { useHistory } from "react-router-dom";

import "../../styles/subject.css";

export const Subject = () => {
  const params = useParams();

  const { store, actions } = useContext(Context);

  const history = useHistory();

  const [subject, setSubject] = useState(null);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetch(process.env.BACKEND_URL + `/api/Subjects/${params.subject_id}`)
      .then((response) => {
        if (!response.ok) throw new Error("La asignatura no existe");

        return response.json();
      })
      .then((data) => setSubject(data))
      .catch((error) => console.log(error));

    //get teachers of Subject
    fetch(
      process.env.BACKEND_URL + `/api/Subjects/${params.subject_id}/Teachers`
    )
      .then((response) => {
        if (!response.ok) throw new Error("La asignatura no existe");

        return response.json();
      })
      .then((data) => setTeachers(data))
      .catch((error) => console.log(error));
  }, []);

  const displayTeachers = (teacher, index) => {
    return <li key={index}>{teacher}</li>;
  };

  const displayPaySection = () => {
    if (!store.user)
      return (
        <div
          className="my-4 d-flex justify-content-center align-items-center"
          id="subject-alert"
        >
          <h5 className="text-white m-0 py-1 text-center">
            ¡¡¡INICIA SESIÓN PARA PODER INSCRIBIRTE EN LA ASIGNATURA!!!
          </h5>
        </div>
      );
    else {
      if (store.user.role == "Student") {
        let singned_up = false;

        for (let subject_obj of store.user.subjects)
          if (subject_obj.id == params.subject_id) {
            singned_up = true;
            break;
          }

        if (singned_up)
          return (
            <div
              className="my-4 d-flex justify-content-center align-items-center"
              id="subject-alert"
            >
              <h6 className="text-white m-0 py-1 text-center">
                ¡¡¡YA ESTAS INSCRITO EN ESTA ASIGNATURA, GESTIONALA DESDE EL
                PANEL DE CONTROL!!!
              </h6>
            </div>
          );
        else
          return (
            <div className="my-4 text-center">
              <div
                className="my-4 d-flex justify-content-center align-items-center d-block"
                id="subject-alert"
              >
                <h4 className="text-white m-0 py-1 text-center">
                  ¡¡¡APUNTATE YA!!!
                </h4>
              </div>
              <div>
                <button
                  type="button"
                  className="btn btn-primary text-center"
                  onClick={checkout}
                >
                  INSCRIBIRSE{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-credit-card ms-1"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z" />
                    <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z" />
                  </svg>
                </button>
              </div>
            </div>
          );
      } else return <div></div>;
    }
  };

  const checkout = async () => {
    const body = {
      cancel_url: window.location.href,
      success_url: `${window.location.href}/payment-success`,
    };

    await fetch(
      process.env.BACKEND_URL + `/api/Checkout/${params.subject_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )
      .then((respond) => {
        if (!respond.ok) throw new Error("Error en el pago");

        return respond.json();
      })
      .then((checkout_url) => history.push(checkout_url))
      .catch((error) => alert(error));
  };

  return (
    <div className="container-fluid">
      <div
        className="row py-3 px-1"
        id="subject-first-header"
        style={{
          backgroundImage: `url(${
            subject
              ? subject.image_url != null
                ? subject.image_url
                : "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
              : ""
          })`,
        }}
      >
        <div className="col-2 d-none d-md-block"></div>
        <div
          className="col-12 col-md-8 d-flex justify-content-center align-items-center"
          id="subject-title-back"
        >
          <h1 className="title-course mx-2" id="subject-course">
            {subject
              ? subject.course_name
                ? subject.course_name.toUpperCase()
                : ""
              : ""}
          </h1>
          <h1 className="title-course">{">"}</h1>
          <h1 className="text-white mx-2" id="subject-name">
            {subject ? (subject.name ? subject.name.toUpperCase() : "") : ""}
          </h1>
        </div>
        <div className="col-2 d-none d-md-block"></div>
      </div>
      <div className="row mt-4" id="subject-details">
        <div className="col-2 d-none d-md-block"></div>
        <div className="col-12 col-md-8">
          <div>
            <strong>DETALLES</strong>
            <div className="ps-2">
              <li id="subject-description">
                {subject
                  ? subject.description
                    ? subject.description
                    : ""
                  : ""}
              </li>
            </div>
          </div>
          <div className="mt-4">
            <strong>FECHA DE INICIO</strong>
            <div className="ps-2">
              <li>
                {subject ? (subject.start_date ? subject.start_date : "") : ""}
              </li>
            </div>
          </div>
          <div className="mt-4">
            <strong>FECHA DE FINALIZACIÓN</strong>
            <div className="ps-2">
              <li>
                {subject ? (subject.end_date ? subject.end_date : "") : ""}
              </li>
            </div>
          </div>
          <div className="mt-4">
            <strong>PROFESORES</strong>
            <div className="ps-2">
              {teachers.map((teacher, index) =>
                displayTeachers(teacher, index)
              )}
            </div>
          </div>
        </div>
        <div className="col-2 d-none d-md-block"></div>
      </div>
      <div className="row" id="payment-section">
        <div className="col-2 d-none d-md-block"></div>
        <div className="col-12 col-md-8">
          {store.user ? store.user.role == "Teacher" ? "" : <hr /> : <hr />}
          {displayPaySection()}
        </div>
        <div className="col-2 d-none d-md-block"></div>
      </div>
    </div>
  );
};
