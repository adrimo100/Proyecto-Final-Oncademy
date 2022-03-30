import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

export const Subject = () => {
  const params = useParams();

  return <div className="container-fluid">ID: {params.subject_id}</div>;
};
