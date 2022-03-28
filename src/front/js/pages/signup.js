import { Form, Formik, useField } from "formik";
import React from "react";
import "../../styles/signup.css";
import { TextField } from "../component/textFIeld";

export const Signup = () => (
  <main>
    <header className="signup-header">
      <div className="container text-white h-100 d-flex align-items-center">
        <h1>NUEVO USUARIO</h1>
      </div>
    </header>

    <Formik
      initialValues={{
        name: "",
        email: "",
        password: "",
        repeatPassword: "",
        invitationCode: "",
      }}
      onSubmit={(values) => console.log(values)}
    >
      <Form className="container py-4">
        <TextField label="Nombre" name="name" />
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
      </Form>
    </Formik>
  </main>
);
