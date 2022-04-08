import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { AppHeader } from "../component/appHeader";
import { AdminDashboard } from "../component/adminDashboard";
import { StudentDashboard } from "../component/studentDashboard";
import { TeacherDashboard } from "../component/teacherDashboard";
import "../../styles/dashboard.css";
import { LoadingAlert } from "../component/loadingAlert";
import { useRedirectGuest } from "../utils";

export const Dashboard = () => {
  const { user } = useContext(Context).store;
  const { loading } = useRedirectGuest();

  return (
    <>
      <AppHeader className="dashboard-header">Panel de control</AppHeader>

      {loading && <LoadingAlert text="Espera, estamos cargando tus datos..." />}

      {user.role == "Admin" && <AdminDashboard />}
      {user.role == "Student" && <StudentDashboard />}
      {user.role == "Teacher" && <TeacherDashboard />}
    </>
  );
};
