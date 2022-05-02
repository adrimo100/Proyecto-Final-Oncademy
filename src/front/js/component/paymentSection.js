import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

import { Modal, Button } from "react-bootstrap";

import { useHistory } from "react-router-dom";

export const PaymentSection = (props) => {
  const { store, actions } = useContext(Context);

  const history = useHistory();

  const [mode, setMode] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

    case "Teacher":
      return <div></div>;

    case true:
      return (
        <div
          className="my-4 d-flex justify-content-center align-items-center"
          id="subject-alert"
        >
          <h6 className="text-white m-0 py-1 text-center">
            YA ESTÁS INSCRITO EN ESTA ASIGNATURA, GESTIÓNALA DESDE EL PANEL
            DE CONTROL
          </h6>
        </div>
      );

    case false:
      case null:
      return (
        <div className="my-1 text-center">
          <div
            className="my-4 d-flex justify-content-center align-items-center d-block"
            id="subject-alert"
          >
          </div>
          <div>
            <button
              type="button"
              className="btn btn-primary text-center"
              onClick={(e) =>{
                  if(mode == null)
                    handleShow();
                  else
                    actions.checkoutSubjectStripe(props.subject_obj.id);
                } 
              }
            >
              INSCRIBIRSE
            </button>
          </div>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>AVISO</Modal.Title>
              </Modal.Header>
              <Modal.Body>Registrate para poder inscribirte en la asignatura.</Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={(e) => {
                  handleClose()
                  history.push("/signup")
                }}>
                  REGISTRARSE
                </Button>
              </Modal.Footer>
            </Modal>
        
        </div>
      );
  }
};
