import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { AppHeader } from "../component/appHeader";
import { AdminDashboard } from "../component/adminDashboard";
import { StudentDashboard } from "../component/studentDashboard";
import { TeacherDashboard } from "../component/teacherDashboard";
import "../../styles/dashboard.css";

export const Dashboard = () => {
  const { store } = useContext(Context);

  const role = store.user?.role;

  return (
    <>
      <AppHeader className="dashboard-header">Panel de control</AppHeader>

      {role == "Admin" && <AdminDashboard />}
      {role == "Student" && <StudentDashboard />}
      {role == "Teacher" && <TeacherDashboard />}
    </>
  );
};
