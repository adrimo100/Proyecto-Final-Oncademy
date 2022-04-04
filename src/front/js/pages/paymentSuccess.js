import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import { Link } from "react-router-dom";

export const PaymentSuccess = () => {
  const params = useParams();

  useEffect(() => {
    fetch(process.env.BACKEND_URL + `/api/Subjects/${params.subject_id}`)
      .then((response) => {
        if (!response.ok) throw new Error("La asignatura no existe");

        return response.json();
      })
      .then((data) => setSubject(data))
      .catch((error) => console.log(error));
  }, []);

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
        <h1 className="text-center">Test</h1>
      </div>
    </div>
  );
};
