import React, { useState } from "react";
import "../../styles/generatedCodeAlert.css";

export const GeneratedCodeAlert = ({ invitationCode }) => {
  const [copied, setCopied] = useState(false);
  const url = window.location.origin + "/signup?code=" + invitationCode;

  function handleCopy() {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div
      className="alert alert-success d-flex justify-content-between align-items-center"
      role="alert"
    >
      <span>
        Enlace generado con éxito: {" "}
        <b className="invitation-code">{url}</b>
      </span>
      <div className="fs-3">
        {copied ? (
          <i className="bi bi-check-lg" />
        ) : (
          <i className="bi bi-clipboard cursor-pointer" onClick={handleCopy} />
        )}
      </div>
    </div>
  );
};
