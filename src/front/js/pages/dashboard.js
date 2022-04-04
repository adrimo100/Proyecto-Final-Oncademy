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
  const { store } = useContext(Context);

  const role = store.user && store.user.role;
  const { loading } = useRedirectGuest();

  return (
    <>
      <AppHeader className="dashboard-header">Panel de control</AppHeader>

      {loading && <LoadingAlert text="Espera, estamos cargando tus datos..." />}

      {role == "Admin" && <AdminDashboard />}
      {role == "Student" && <StudentDashboard />}
      {role == "Teacher" && <TeacherDashboard />}
    </>
  );
};
