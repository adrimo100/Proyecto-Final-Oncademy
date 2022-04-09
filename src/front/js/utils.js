import React, { useContext, useEffect, useState } from "react";
import { Context } from "./store/appContext";
import { useHistory } from "react-router-dom";

export const toCamelCase = (string) =>
  string
    .split("_")
    .map((word, i) =>
      i > 0 ? [word[0].toUpperCase() + word.slice([1])] : word
    )
    .join("");

export const useRedirectAuthenticated = (path = "/dashboard") => {
  const {
    store: { user },
  } = useContext(Context);
  const history = useHistory();

  if (user) {
    history.push(path);
  }
};

/** Returns the authentication token and listen for changes in it. */
export const useAuthenticationToken = () => {
  const [token, setHookToken] = useState(getToken());

  function handleUpdatedToken() {
    setHookToken(getToken());
  }

  useEffect(() => {
    // Subscribe for document changes to token
    window.addEventListener("updatedToken", handleUpdatedToken);

    return () => {
      window.removeEventListener("updatedToken", handleUpdatedToken);
    };
  }, []);

  return token;
};

/** Redirects unauthenticated users. Returns loading flag, which is true
 *  when there is a token that we are validating. */
export const useRedirectGuest = (path = "/login") => {
  const history = useHistory();
  const user = useContext(Context).store.user;
  const token = useAuthenticationToken();

  const loading = token && !user;

  if (!user && !token) {
    history.push(path);
  }

  return { loading };
};

// Token-related logic. We use an event to track changes to the token
const updatedTokenEvent = new Event("updatedToken");

export const removeToken = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(updatedTokenEvent);
};

export const setToken = (token) => {
  localStorage.setItem("token", token);
  window.dispatchEvent(updatedTokenEvent);
};

export const getToken = () => localStorage.getItem("token");

/**
 * Helper that:
 * - Adds server url to path.
 * - If authenticated is true, adds Authorization header with token.
 * - If method is POST, adds body as JSON and sets Content-Type header.
 */
export const appFetch = (path, requestInit = {}, authenticated) => {
  const url = process.env.BACKEND_URL + path;
  const init = {
    // We assure headers is always defined
    headers: {},
    ...requestInit,
  };

  if (authenticated) {
    init.headers["Authorization"] = "Bearer " + getToken();
  }

  if (init.method === "POST") {
    init.body = JSON.stringify(init.body);
    init.headers["Content-Type"] = "application/json";
  }

  return fetch(url, init);
};
