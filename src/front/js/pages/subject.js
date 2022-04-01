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
          <h5 className="text-white m-0 py-1">
            ¡¡¡INICIA SESIÓN PARA PODER INSCRIBIRTE EN LA ASIGNATURA!!!
          </h5>
        </div>
      );
    else if (store.user.role == "Student")
      return (
        <div className="my-4 d-flex justify-content-center align-items-center">
          <hr></hr>
          <div>BOTONES DE PAGO</div>
        </div>
      );
    else return <div></div>;
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
