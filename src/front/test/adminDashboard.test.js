import React from "react"
import { StudentList } from "../js/component/studentList";
import { render, screen } from "./test-utils";
import userEvent from "@testing-library/user-event"

describe("AdminDashboard", () => {
  describe("SudentsList", () => {  
    it("should have a students section", () => {
      render(<StudentList />);
      const title = screen.getByRole("heading", { name: "Estudiantes" });
      
      expect(title).toBeInTheDocument()
    })

    describe("when filtering by name", () => {
      async function filterByName(user) {
        const input = screen.getByLabelText(/nombre/i);
        await user.type(input, "Jhon");
        const submitButton = screen.getByRole("button", { name: /buscar/i });
        await user.click(submitButton);        
      }
      
      it("should be possible to filter by name", async () => {
        const user = userEvent.setup()
        render(<StudentList />);
  
        await filterByName(user);
        
        expect(fetch.mock.calls[0][0]).toMatch("/api/users?userName=Jhon")
      })

      it("should display errors if there are any", async () => {
        const user = userEvent.setup()
        render(<StudentList />);
        const expectedError = "Couldn't connect."
        fetch.mockResponse(JSON.stringify({ error: expectedError }), { status: 400 })
  
        await filterByName(user)
        const error = await screen.findByText(expectedError);
  
        expect(error).toBeInTheDocument()
      })
    })

  })})