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
        Para que un nuevo profesor pueda registrase, debes generar un código de
        invitación y hacérselo llegar. Deberá introducirlo en el formulario de
        registro, en el apartado de "Código de invitación". De no hacerlo, al
        registrarse lo hará como alumno.
      </p>

      <button className="btn btn-primary mb-3" onClick={generateCode}>
        Generar un código de invitación
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
