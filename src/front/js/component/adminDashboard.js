import React from "react";
import { Payments } from "./payments";
import { StudentList } from "./studentList";
import { TeacherInvitations } from "./teacherInvitations";

export const AdminDashboard = () => {
  return (
    <main className="app-container py-4">
      <TeacherInvitations />
      <Payments />
      <StudentList />
    </main>
  );
};
