import React, { useContext, useEffect, useMemo, useState } from "react";
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

export const usePagination = ({ path , parameters }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [error, setError] = useState(null);

  // We memoize the query parameters to avoid unnecessary re-rendering
  // and therefore unnecessary fetching.
  const queryString = useMemo(() => {
      const params = new URLSearchParams();
      Object.entries(parameters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      return params.toString();
  }, [parameters])

  async function getItems() {
    try {
      setError(null);

      // Fetch the items
      const res = await appFetch(`${path}?${queryString}`, null, true);
      const body = await res.json();

      // Handle unsuccessful responses
      if (!res.ok) {
        if (body.error) return setError(body.error);
        throw new Error();
      }

      // Store response data in state
      setItems(body.items);
      setTotal(body.total);
      setPages(body.pages);
    } catch (error) {
      console.error(error);
      setError("No se ha podido conectar con el servidor, prueba más tarde.");
    }
  }

  useEffect(() => {
    getItems();
  }, [queryString]);

  return {
    items,
    total,
    pages,
    error,
  }
}