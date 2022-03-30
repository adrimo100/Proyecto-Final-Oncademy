import React from "react";
import { Link } from "react-router-dom";

export const SubjectCard = (props) => {
  return (
    <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3 mx-0 p-0 d-flex justify-content-center align-items-center">
      <div className="card" style={{ width: "15rem" }}>
        <div className="card-body p-0">
          <img
            src={
              props.subject.image
                ? props.subject.image
                : "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
            }
            className="card-img-top"
            alt=""
          />
          <div className="p-2 details-box text-center">
            <h5 className="card-title mt-3">{props.subject.name}</h5>

            <p className="card-text">{props.subject.cardDescription}</p>

            <Link to={`/subject/${props.subject.id}`}>
              <a className="btn btn-primary subject-btn">Saber más...</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
