import React from "react";
import { Payments } from "./payments";
import { TeacherInvitations } from "./teacherInvitations";
import { UsersSection } from "./usersSection";

export const AdminDashboard = () => {
  return (
    <main className="app-container py-4">
      <UsersSection />
      <TeacherInvitations />
      <Payments />
    </main>
  );
};
