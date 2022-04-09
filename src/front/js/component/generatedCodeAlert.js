import React, { useState } from "react";
import "../../styles/generatedCodeAlert.css";

export const GeneratedCodeAlert = ({ invitationCode }) => {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(invitationCode);
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
        Código generado con éxito:{" "}
        <b className="invitation-code">{invitationCode}</b>
      </span>
      <div className="fs-3">
        {copied ? (
          <i class="bi bi-check-lg"></i>
        ) : (
          <a href="#" onClick={handleCopy}>
            <i className="bi bi-clipboard text-success"></i>
          </a>
        )}
      </div>
    </div>
  );
};
