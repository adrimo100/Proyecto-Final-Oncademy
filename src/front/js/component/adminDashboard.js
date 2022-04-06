import React from "react";
import { Payments } from "./payments";
import { TeacherInvitations } from "./teacherInvitations";

export const AdminDashboard = () => {
  return (
    <main className="app-container py-4">
      <TeacherInvitations />
      <Payments />
    </main>
  );
};
