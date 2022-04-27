import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const PaymentSection = (props) => {
  const { store, actions } = useContext(Context);

  const [mode, setMode] = useState(false);

  useEffect(() => {
    if (!store.user) setMode(null);
    else if (store.user.role == "Student") {
      for (let subject of store.user.subjects) {
        if (subject.id == props.subject_obj.id) {
          setMode(true);
          break;
        }
      }
    } else if (store.user.role != "Student") setMode("Teacher");
    else setMode(false);
  }, [store.user]);

  switch (mode) {
    default:
      return <div></div>;

    case null:
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

    case "Teacher":
      return <div></div>;

    case true:
      return (
        <div
          className="my-4 d-flex justify-content-center align-items-center"
          id="subject-alert"
        >
          <h6 className="text-white m-0 py-1 text-center">
            ¡¡¡YA ESTÁS INSCRITO EN ESTA ASIGNATURA, GESTIONALA DESDE EL PANEL
            DE CONTROL!!!
          </h6>
        </div>
      );

    case false:
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
              onClick={() =>
                actions.checkoutSubjectStripe(props.subject_obj.id)
              }
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
  }
};
