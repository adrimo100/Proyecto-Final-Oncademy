import React from "react";
import { getLastFetchCall, render, screen } from "./test-utils";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";
import { UsersSection } from "../js/component/usersSection";
import { waitFor } from "@testing-library/react";

jest.mock("../js/component/editUserModal");

faker.setLocale("es");

describe("AdminDashboard", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  describe("UsersList", () => {
    describe("should display a list of users", () => {
      const expectedUsers = new Array(10).fill(1).map(() => ({
        full_name: faker.name.findName(),
        subjects: faker.random.arrayElements([
          { name: "Matemáticas" },
          { name: "Física" },
          { name: "Química" },
        ]),
      }));

      test.each(expectedUsers.map((u) => u.full_name))(
        "should display user %s",
        async (user) => {
          fetch.once(
            JSON.stringify({
              pages: 1,
              total: 10,
              items: expectedUsers,
            })
          );
          render(<UsersSection />);

          const userName = await screen.findByText(user);
          expect(userName);
        }
      );
    });

    it("displays errors if there are any", async () => {
      const expectedError = "Couldn't connect.";
      fetch.mockResponse(JSON.stringify({ error: expectedError }), {
        status: 400,
      });
      render(<UsersSection />);

      const error = await screen.findByText(expectedError);

      expect(error).toBeInTheDocument();
    });

    describe("when filtering", () => {
      it("can filter by name", async () => {
        const user = userEvent.setup();
        render(<UsersSection />);

        const input = screen.getByLabelText(/nombre/i);
        await user.type(input, "Jhon");
        const submitButton = screen.getByRole("button", { name: /buscar/i });
        await user.click(submitButton);

        await waitFor(() => {
          expect(getLastFetchCall()[0]).toMatch(/userName=Jhon/);
        });
      });

      it.each(["Student", "Teacher"])("can filter by role %s", async (role) => {
        const user = userEvent.setup();
        render(<UsersSection />);

        const rolSelect = screen.getByRole("combobox", {
          name: /rol/i,
        });
        await user.selectOptions(rolSelect, role);
        const submitButton = screen.getByRole("button", {
          name: /buscar/i,
        });
        await user.click(submitButton);

        await waitFor(() => {
          expect(getLastFetchCall()[0]).toMatch(
            new RegExp(`role=${role}`, "i")
          );
        });
      });
    });
  });
});
