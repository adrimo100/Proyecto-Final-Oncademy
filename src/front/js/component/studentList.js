import React, { useState } from "react"
import { appFetch } from "../utils";
import { FilterByNameForm } from "./filterByNameForm"

export const StudentList = () => {
  const [ error, setError ] = useState(null);

  async function handleSubmit({ userName }) {
    try {
        setError(null)
        const res = await appFetch(
          "/api/users" + (userName ? `?userName=${userName}` : ""),
          null,
          true
        );
        const body = await res.json();

        if (!res.ok) {
          throw new Error(body.error || "No se ha podido conectar con el servidor, prueba más tarde.");
        }

      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    }

  return (
    <article>
      <h2>Estudiantes</h2>

      <FilterByNameForm handleSubmit={handleSubmit} error={error}/>
    </article>
)}