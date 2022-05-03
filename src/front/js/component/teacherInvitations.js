import React, { useState } from "react";
import { getToken } from "../utils";
import { GeneratedCodeAlert } from "./generatedCodeAlert";

export const TeacherInvitations = () => {
  const [invitationCode, setInvitationCode] = useState(null);
  const [error, setError] = useState(null);

  async function generateCode() {
    setInvitationCode(null);
    setError(null);

    try {
      const res = await fetch(
        process.env.BACKEND_URL + "/api/invitation-codes",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      const body = await res.json();

      if (res.ok) return setInvitationCode(body.invitationCode);

      throw new Error(body.error || "Error desconocido generando el código.");
    } catch (error) {
      console.error(error.message);
      setError("No se ha podido generar el código. Prueba de nuevo.");
    }
  }

  return (
    <article>
      <p>
        Si un profesor quiere crear su cuenta, deberá hacerlo a través de un link de un 
        solo uso que puedes generar aquí.
      </p>

      <button className="btn btn-primary mb-3" onClick={generateCode}>
        Generar un enlace
      </button>

      {invitationCode && <GeneratedCodeAlert invitationCode={invitationCode} />}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </article>
  );
};
