import React from "react"
import { Footer } from "../js/component/footer.js";
import { render, screen } from "./test-utils";

describe("Footer", () => {
  it("should render", () => {
    render(<Footer />);

    expect(screen.getByText(/ONACADEMY/)).toBeInTheDocument();
  });
})