import { Form, Formik } from "formik";
import React, { useContext, useState } from "react";
import "../../styles/signup.css";
import { TextField } from "../component/textFIeld";
import { Context } from "../store/appContext";
import { loginValidationSchema } from "../validation";

export const Login = () => {
  const { store, actions } = useContext(Context);

  const [formError, setFormError] = useState("");

  async function hanldeSubmit(values) {
    setFormError("");

    const { error } = await actions.login(values);

    if (error) setFormError(error);
  }

  return (
    <main>
      <header className="signup-header">
        <div className="container text-white h-100 d-flex align-items-center">
          <h1>LOGIN</h1>
        </div>
      </header>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={loginValidationSchema}
        onSubmit={hanldeSubmit}
      >
        <Form className="container py-4">
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
