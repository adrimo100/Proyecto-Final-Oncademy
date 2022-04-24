import React from "react";
import injectContext from "../js/store/appContext";
import { render } from "@testing-library/react"

const AllTheProviders = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: injectContext(AllTheProviders), ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };

export const getLastFetchCall = () => fetch.mock.calls[fetch.mock.calls.length - 1]; 