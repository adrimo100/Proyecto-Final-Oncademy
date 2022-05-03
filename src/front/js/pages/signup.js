import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import "../../styles/auth.css";
import { TextField } from "../component/textField";
import { signupValidationSchema } from "../validation";
import { Context } from "../store/appContext";
import { toCamelCase, useRedirectAuthenticated } from "../utils";
import { AppHeader } from "../component/appHeader";
import { useLocation } from "react-router-dom";

export const Signup = () => {
  useRedirectAuthenticated();
  const { store, actions } = useContext(Context);

  const location = useLocation();
  const invitationCode = new URLSearchParams(location.search).get("code");

  const [formError, setFormError] = useState("");

  async function hanldeSubmit(values, { setFieldError }) {
    setFormError("");

    const { error, validationErrors } = await actions.addUser({
      ...values,
      invitationCode,
    });

    if (error) setFormError(error);

    if (validationErrors) {
      Object.entries(validationErrors).forEach(([key, value]) => {
        setFieldError(toCamelCase(key), value);
      });
    }
  }

  return (
    <main>
      <AppHeader className="auth-header">
        NUEVO {invitationCode ? "PROFESOR" : "ALUMNO"}
      </AppHeader>

      <Formik
        initialValues={{
          fullName: "",
          email: "",
          password: "",
          repeatPassword: "",
        }}
        validationSchema={signupValidationSchema}
        onSubmit={hanldeSubmit}
      >
        <Form className="app-container py-4">
          <TextField label="Nombre" name="fullName" />
          <TextField label="Correo electrónico" name="email" type="email" />
          <TextField label="Contraseña" name="password" type="password" />
          <TextField
            label="Repite la contraseña"
            name="repeatPassword"
            type="password"
          />

          <button type="submit" className="btn btn-primary">
            Registrarse
          </button>

          {formError && <p className="mt-3 text-danger">{formError}</p>}
          {store.user && (
            <p className="mt-3 text-success">
              ¡Registro completado! Bienvenido {store.user.full_name}.
            </p>
          )}
        </Form>
      </Formik>
    </main>
  );
};
