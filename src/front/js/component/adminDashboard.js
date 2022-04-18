import React from "react";
import { Payments } from "./payments";
import { TeacherInvitations } from "./teacherInvitations";
import { UserList } from "./userList";

export const AdminDashboard = () => {
  return (
    <main className="app-container py-4">
      <TeacherInvitations />
      <Payments />
      <UserList />
    </main>
  );
};
