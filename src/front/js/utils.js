import React, { useContext } from "react";
import { Context } from "./store/appContext";
import { useHistory } from "react-router-dom";

export const toCamelCase = (string) =>
  string
    .split("_")
    .map((word, i) =>
      i > 0 ? [word[0].toUpperCase() + word.slice([1])] : word
    )
    .join("");

export const useRedirectAuthenticated = (path = "/") => {
  const {
    store: { user },
  } = useContext(Context);
  const history = useHistory();

  if (user) {
    history.push(path);
  }
};
