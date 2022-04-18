import React from "react";
import { UserList } from "../js/component/userList";
import { render, screen } from "./test-utils";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";
import { act } from "react-test-renderer";

describe("AdminDashboard", () => {
  describe("UsersList", () => {
    it("should have a users section", () => {
      render(<UserList />);
      const title = screen.getByRole("heading", { name: /usuarios/i });

      expect(title).toBeInTheDocument();
    });

    describe("when filtering", () => {
      async function filterByName(user) {
        const input = screen.getByLabelText(/nombre/i);
        await user.type(input, "Jhon");
        const submitButton = screen.getByRole("button", { name: /buscar/i });
        await user.click(submitButton);
      }

      it("should be possible to filter by name", async () => {
        const user = userEvent.setup();
        render(<UserList />);

        await filterByName(user);

        expect(fetch.mock.calls[0][0]).toMatch(/userName=Jhon/);
      });

      describe("by role", () => {
        async function filterByRole(role) {
          const user = userEvent.setup();
          render(<UserList />);

          const rolSelect = screen.getByRole("combobox", { name: /rol/i });

          await user.selectOptions(rolSelect, role);

          const submitButton = screen.getByRole("button", { name: /buscar/i });
          await user.click(submitButton);
        }
        // selectOptions does not work
        test.skip("can filter for teachers", async () => {
          const user = userEvent.setup();
          render(<UserList />);

          const rolSelect = screen.getByRole("combobox", { name: /rol/i });
          await user.selectOptions(rolSelect, "Teacher");

          const submitButton = screen.getByRole("button", { name: /buscar/i });
          await user.click(submitButton);

          expect(fetch.mock.calls[0][0]).toMatch(/role=Teacher/);
        });
        test("can filter for students", async () => {
          await filterByRole("Estudiantes");

          expect(fetch.mock.calls[0][0]).toMatch(/role=Student/);
        });
      });

      it("should display errors if there are any", async () => {
        const user = userEvent.setup();
        render(<UserList />);
        const expectedError = "Couldn't connect.";
        fetch.mockResponse(JSON.stringify({ error: expectedError }), {
          status: 400,
        });

        await filterByName(user);
        const error = await screen.findByText(expectedError);

        expect(error).toBeInTheDocument();
      });
    });
  });
});
