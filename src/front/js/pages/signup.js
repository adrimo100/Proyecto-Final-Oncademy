import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import "../../styles/auth.css";
import { TextField } from "../component/textFIeld";
import { signupValidationSchema } from "../validation";
import { Context } from "../store/appContext";
import { toCamelCase, useRedirectAuthenticated } from "../utils";
import { AppHeader } from "../component/appHeader";

export const Signup = () => {
  useRedirectAuthenticated();
  const { store, actions } = useContext(Context);

  const [formError, setFormError] = useState("");

  async function hanldeSubmit(values, { setFieldError }) {
    setFormError("");

    const { error, validationErrors } = await actions.addUser(values);

    if (error) setFormError(error);

    if (validationErrors) {
      Object.entries(validationErrors).forEach(([key, value]) => {
        setFieldError(toCamelCase(key), value);
      });
    }
  }

  return (
    <main>
      <AppHeader className="auth-header">NUEVO USUARIO</AppHeader>

      <Formik
        initialValues={{
          fullName: "",
          email: "",
          password: "",
          repeatPassword: "",
          invitationCode: "",
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
          <TextField
            label="Código de invitación (opcional)"
            name="invitationCode"
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
