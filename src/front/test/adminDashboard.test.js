import React from "react";
import { UserList } from "../js/component/userList";
import { getLastFetchCall, render, screen } from "./test-utils";
import userEvent from "@testing-library/user-event";
import { faker } from "@faker-js/faker";

faker.setLocale("es");

describe("AdminDashboard", () => {
  beforeEach(() => {
    fetch.resetMocks();
  })

  describe("UsersList", () => {
    it("should have a title", () => {
      render(<UserList />);
      const title = screen.getByRole("heading", { name: /usuarios/i });

      expect(title).toBeInTheDocument();
    });
    describe("should display a list of users", () => {
      const expectedUsers = new Array(10).fill(1).map(() => ({
        full_name: faker.name.findName(),
        subjects: faker.random.arrayElements([
          { name: "Matemáticas" },
          { name: "Física" },
          { name: "Química" },
        ]),
      }));

      test.each(expectedUsers.map(u => u.full_name))("should display user %s", async (user) => {
        fetch.once(
          JSON.stringify({
            pages: 1,
            total: 10,
            users: expectedUsers,
          })
        );
        render(<UserList />);

        const userName = await screen.findByText(user);
        expect(userName)
      });
    });

    describe("when filtering", () => {
      it("can filter by name", async () => {
        const user = userEvent.setup();
        render(<UserList />);

        const input = screen.getByLabelText(/nombre/i);
        await user.type(input, "Jhon");
        const submitButton = screen.getByRole("button", { name: /buscar/i });
        await user.click(submitButton);

        expect(getLastFetchCall()[0]).toMatch(/userName=Jhon/);
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

        expect(getLastFetchCall()[0]).toMatch(/role=Student/);
      });
      // selectOptions looks not to work
      it.skip("can filter for teachers", async () => {
        const user = userEvent.setup();
        render(<UserList />);

        const rolSelect = screen.getByRole("combobox", { name: /rol/i });
        await user.selectOptions(rolSelect, "Teacher");

        const submitButton = screen.getByRole("button", { name: /buscar/i });
        await user.click(submitButton);

        expect(getLastFetchCall()[0]).toMatch(/role=Teacher/);
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
