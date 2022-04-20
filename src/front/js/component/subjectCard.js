import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

import { Button, Modal } from "react-bootstrap";

export const SubjectCard = (props) => {
  const { store, actions } = useContext(Context);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3 mx-0 p-0 d-flex justify-content-center align-items-center">
      <div className="card" style={{ width: "15rem" }}>
        <div className="card-body p-0">
          <img
            src={
              props.subject.image_url != "null"
                ? props.subject.image_url
                : "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            }
            className="card-img-top"
            alt=""
          />
          <div className="p-2 details-box text-center">
            <h5 className="card-title mt-3">{props.subject.name}</h5>

            <p className="card-text">{props.subject.cardDescription}</p>

            <div
              className="d-flex justify-content-center align-items-center subject-btn"
              style={{ width: "93%" }}
            >
              <Link
                className="btn btn-primary"
                to={`/subject/${props.subject.id}`}
              >
                Saber más...
              </Link>

              {props.dashboard ? (
                <button className="btn btn-danger ms-1" onClick={handleShow}>
                  Cancelar Subscripción
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>AVISO</Modal.Title>
        </Modal.Header>
        <Modal.Body>{`Estás a punto de cancelar ${props.subject.name} - ${props.subject.course_name}. ¿Estás seguro?`}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Salir
          </Button>
          <Button
            variant="danger"
            onClick={(e) => {
              handleClose();
              actions.cancelSubscription(props.subject.id);
            }}
          >
            Cancelar Subscripción
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
