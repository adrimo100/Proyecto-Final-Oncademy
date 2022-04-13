import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";

export const EditUser = () => {
  const { store, actions } = useContext(Context);

  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");

  const [wrongOldPasswordError, setWrongOldPasswordError] = useState(false);
  const [shortNewPasswordError, setShortNewPasswordError] = useState(false);
  const [nomatchError, setNoMatchError] = useState(false);

  const nameSection = () => {
    if (!editName)
      return (
        <div className="d-flex">
          <p className="ps-1">{store.user?.full_name}</p>
          <div className="m-0 p-0">
            <button
              className="btn btn-whites ms-1 p-0"
              style={{ width: "20px" }}
              onClick={handleNameClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                fill="currentColor"
                className="bi bi-pencil-square m-0 p-0"
                viewBox="0 0 16 16"
              >
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path
                  fill-rule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                />
              </svg>
            </button>
          </div>
        </div>
      );
    else
      return (
        <div className="ps-1 mt-1">
          <form
            className="d-flex"
            onSubmit={(e) => {
              e.preventDefault();
              editUserData(newName, store.user?.full_name, "full_name");
            }}
          >
            <input
              type="text"
              onChange={(e) => setNewName(e.target.value)}
            ></input>

            <button
              className="btn btn-success ms-1 p-0 d-flex justify-content-center align-items-center"
              onClick={(e) => {
                editUserData(newName, store.user?.full_name, "full_name");
              }}
              style={{ width: "2vw" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50%"
                height="50%"
                fill="currentColor"
                className="bi bi-pencil-square m-0 p-0"
                viewBox="0 0 16 16"
              >
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          </form>
        </div>
      );
  };

  const handleNameClick = () => setEditName(!editName);

  const emailSection = () => {
    if (!editEmail)
      return (
        <div className="d-flex">
          <p className="ps-1">{store.user?.email}</p>
          <div className="m-0 p-0">
            <button
              className="btn btn-whites ms-1 p-0"
              style={{ width: "20px" }}
              onClick={handleEmailClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                fill="currentColor"
                className="bi bi-pencil-square m-0 p-0"
                viewBox="0 0 16 16"
              >
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path
                  fill-rule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                />
              </svg>
            </button>
          </div>
        </div>
      );
    else
      return (
        <div className="ps-1 mt-1">
          <form
            className="d-flex"
            onSubmit={(e) => {
              e.preventDefault();
              editUserData(newEmail, store.user?.email, "email");
            }}
          >
            <input
              type="text"
              onChange={(e) => setNewEmail(e.target.value)}
            ></input>

            <button
              className="btn btn-success ms-1 p-0 d-flex justify-content-center align-items-center"
              onClick={(e) => {
                editUserData(newEmail, store.user?.email, "email");
              }}
              style={{ width: "2vw" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50%"
                height="50%"
                fill="currentColor"
                className="bi bi-pencil-square m-0 p-0"
                viewBox="0 0 16 16"
              >
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
              </svg>
            </button>
          </form>
        </div>
      );
  };

  const handleEmailClick = () => setEditEmail(!editEmail);

  const editUserData = (new_value, old_value, field_name) => {
    setEditName(false);
    setEditEmail(false);
    setNewEmail("");
    setNewName("");

    if (new_value == "") return;

    actions.editUser(new_value, old_value, field_name);
  };

  const editUserPassword = async () => {
    setShortNewPasswordError(false);
    setNoMatchError(false);
    setWrongOldPasswordError(false);

    if (newPassword.length < 8) {
      setShortNewPasswordError(true);
      return;
    }

    if (newPassword != repeatedPassword) {
      setNoMatchError(true);
      return;
    }

    if (await actions.checkPassword(oldPassword)) {
      setWrongOldPasswordError(true);
      return;
    }

    //Call the endpoint to change the password
    actions.changePassword(store.user.email, oldPassword, newPassword);

    //Reset states
    setOldPassword("");
    setNewPassword("");
    setRepeatedPassword("");
  };

  return (
    <div>
      <div>
        <h2>Tus Datos</h2>
      </div>
      <div className="d-flex">
        <strong>Nombre:</strong>
        {nameSection()}
      </div>
      <div className="d-flex">
        <strong>Email:</strong>
        {emailSection()}
      </div>

      <hr />

      <h2>Cambiar La Contraseña</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          editUserPassword();
        }}
      >
        <div className="d-flex">
          <div></div>
          <div>
            <div className="d-flex">
              <input
                type="password"
                placeholder="Antigua Contraseña"
                onChange={(e) => setOldPassword(e.target.value)}
              ></input>
              {wrongOldPasswordError ? (
                <p className="text-danger">Contraseña Incorrecta</p>
              ) : (
                ""
              )}
              <input
                type="password"
                className="ms-4"
                placeholder="Nueva Contraseña"
                onChange={(e) => setNewPassword(e.target.value)}
              ></input>
              <input
                type="password"
                className="ms-1"
                placeholder="Repetir Nueva Contraseña"
                onChange={(e) => setRepeatedPassword(e.target.value)}
              ></input>
              <div>
                <button
                  className="btn btn-success ms-2"
                  onClick={(e) => {
                    e.preventDefault();
                    editUserPassword();
                  }}
                >
                  Cambiar Contraseña
                </button>
              </div>
            </div>
            <div className="d-block">
              {nomatchError ? (
                <p className="text-danger ms-4">Las Contraseñas no coinciden</p>
              ) : (
                ""
              )}
              {shortNewPasswordError ? (
                <p className="text-danger ms-4">
                  La contraseña debe contener 8 caracteres o más
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </form>

      <hr />
    </div>
  );
};
