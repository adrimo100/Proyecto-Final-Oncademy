import React from "react";
import { UserList } from "../js/component/userList";
import { render, screen } from "./test-utils";
import userEvent from "@testing-library/user-event";

describe("AdminDashboard", () => {
  describe("UsersList", () => {
    it("should have a users section", () => {
      render(<UserList />);
      const title = screen.getByRole("heading", { name: /usuarios/i });

      expect(title).toBeInTheDocument();
    });

    describe("when filtering", () => {
      it("can filter by name", async () => {
        const user = userEvent.setup();
        render(<UserList />);
  
        const input = screen.getByLabelText(/nombre/i);
        await user.type(input, "Jhon");
        const submitButton = screen.getByRole("button", { name: /buscar/i });
        await user.click(submitButton);      

        expect(fetch.mock.calls[0][0]).toMatch(/userName=Jhon/);
      });

      it("can filter by role", async () => {
        const user = userEvent.setup();
        render(<UserList />);

        const rolSelect = screen.getByRole("combobox", {
          name: /rol/i,
        });
        await user.selectOptions(rolSelect, "Student");
        const submitButton = screen.getByRole("button", {
          name: /buscar/i,
        });
        await user.click(submitButton);

        expect(fetch.mock.calls[0][0]).toMatch(/role=Student/);
      });
      // selectOptions looks not to work
      it.skip("can filter for teachers", async () => {
        const user = userEvent.setup();
        render(<UserList />);

        const rolSelect = screen.getByRole("combobox", { name: /rol/i });
        await user.selectOptions(rolSelect, "Teacher");

        const submitButton = screen.getByRole("button", { name: /buscar/i });
        await user.click(submitButton);

        expect(fetch.mock.calls[0][0]).toMatch(/role=Teacher/);
      });

      it("displays errors if there are any", async () => {
        const user = userEvent.setup();
        render(<UserList />);
        const expectedError = "Couldn't connect.";
        fetch.mockResponse(JSON.stringify({ error: expectedError }), {
          status: 400,
        });

        const submitButton = screen.getByRole("button", { name: /buscar/i });
        await user.click(submitButton);
        const error = await screen.findByText(expectedError);

        expect(error).toBeInTheDocument();
      });
    });
  });
});
