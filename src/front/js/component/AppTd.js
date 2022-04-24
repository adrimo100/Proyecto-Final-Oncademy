import React from "react";

export const AppTd = ({ children, className }) => (
  <td>
    <div className={"vertical-center " + (className || "") }>{children}</div>
  </td>
);