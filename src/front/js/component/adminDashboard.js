import React from "react";
import { Switch } from "react-router-dom";
import { Link } from "react-router-dom";
import { Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { useRouteMatch } from "react-router-dom";
import { Payments } from "./payments";
import { SubjectsSection } from "./subjectsSection";
import { TeacherInvitations } from "./teacherInvitations";
import { UsersSection } from "./usersSection";

export const AdminDashboard = () => {
  const { path } = useRouteMatch();
  const location = useLocation();
  const activePath = location.pathname.split("/").pop();

  const sections = [
    {
      title: "Usuarios",
      Component: UsersSection,
      path: "users",
    },
    {
      title: "Asignaturas",
      Component: SubjectsSection,
      path: "subjects",
    },
    {
      title: "Pagos",
      Component: Payments,
      path: "payments",
    },
    {
      title: "Invitar Profesores",
      Component: TeacherInvitations,
      path: "teacher-invitations",
    },
  ];

  return (
    <main className="app-container py-4">
      <ul className="nav nav-tabs mb-3">
        {sections.map((section) => (
          <li className="nav-item" key={section.path}>
            <Link
              to={`${path}/${section.path}`}
              className={`nav-link ${section.path === activePath && "active"}`}
            >
              {section.title}
            </Link>
          </li>
        ))}
      </ul>

      <Switch>
        {sections.map((section) => (
          <Route exact path={`${path}/${section.path}`} key={path}>
            <section.Component />
          </Route>
        ))}

        <Route path="/">
          <Redirect to={`/dashboard/users`} />
        </Route>
      </Switch>
    </main>
  );
};
