import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import "../../styles/auth.css";
import { AppHeader } from "../component/appHeader";
import { TextField } from "../component/textFIeld";
import { Context } from "../store/appContext";
import { useRedirectAuthenticated } from "../utils";
import { loginValidationSchema } from "../validation";

export const Login = () => {
  useRedirectAuthenticated();
  const { store, actions } = useContext(Context);

  const [formError, setFormError] = useState("");

  async function hanldeSubmit(values) {
    setFormError("");

    const { error } = await actions.login(values);

    if (error) setFormError(error);
  }

  return (
    <main>
      <AppHeader className="auth-header">LOGIN</AppHeader>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={loginValidationSchema}
        onSubmit={hanldeSubmit}
      >
        <Form className="app-container py-4">
          <TextField label="Correo electrónico" name="email" type="email" />
          <TextField label="Contraseña" name="password" type="password" />

          <button type="submit" className="btn btn-primary">
            Iniciar sesión
          </button>

          {formError && <p className="mt-3 text-danger">{formError}</p>}
          {store.user && (
            <p className="mt-3 text-success">
              ¡Bienvenido {store.user.full_name}!
            </p>
          )}
        </Form>
      </Formik>
    </main>
  );
};
