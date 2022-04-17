import React from "react"
import { StudentList } from "../js/component/studentList";
import { render, screen } from "./test-utils";

describe("AdminDashboard", () => {
  describe("SudentsList", () => {
    beforeEach(() => render(<StudentList />));
  
    it("should have a students section", () => {
      const title = screen.getByRole("heading", { name: "Estudiantes" });
      
      expect(title).toBeInTheDocument()
    })

    it.skip("should have a search by name form", () => {
    })
  })})