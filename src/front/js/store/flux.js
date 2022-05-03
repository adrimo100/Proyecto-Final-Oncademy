import { appFetch, getToken, removeToken, setToken } from "../utils";

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      courses: [],
      requestedCourse: { name: null, id: 0, subjects: [] },
      user: null,
    },
    actions: {
      // Use getActions to call a function within a fuction

      getCourses: async () => {
        await fetch(process.env.BACKEND_URL + "/api/Courses")
          .then((response) => {
            if (!response.ok) throw new Error("Error al recuperar los cursos");

            return response.json();
          })
          .then((data) => setStore({ courses: data }))
          .catch((error) => console.log(error));
      },

      getRequestedCourse: async (curse_id) => {
        await fetch(process.env.BACKEND_URL + `/api/Courses/${curse_id}`)
          .then((response) => {
            if (!response.ok) throw new Error("No existe el curso indicado");

            return response.json();
          })
          .then((data) => {
            setStore({ requestedCourse: data });
          })
          .catch((error) => console.log(error));
      },

      checkoutSubjectStripe: async (subject_id) => {
        const store = getStore();

        const session_data = {
          user_email: store.user?.email,
          success_url: window.location.href + `/success`,
          cancel_url: window.location.href,
          subject_id: subject_id,
        };

        await fetch(process.env.BACKEND_URL + "/api/createCheckoutSession", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(session_data),
        })
          .then((response) => {
            if (!response.ok)
              throw new Error("Error al crear la sesión de pago");

            return response.json();
          })
          .then((data) => window.location.replace(data.session_url))
          .catch((error) => alert(error));
      },

      checkSubscription: async (subject_id) => {
        await fetch(
          process.env.BACKEND_URL + `/api/check-subscription/${subject_id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(getStore(user)),
          }
        )
          .then((response) => {
            if (!response.ok) throw new Error("No existe el curso indicado");

            return response.json();
          })
          .then((data) => {
            console.log(data);
            return data;
          })
          .catch((error) => console.log(error));
      },
      addUser: async (user) => {
        try {
          const res = await appFetch("/api/users", {
            method: "POST",
            body: user,
          });

          const body = await res.json();

          if (res.ok) return getActions().setAuthenticatedUser(body);

          // Return the payload so the form can set errors
          return body;
        } catch (error) {
          console.error(error);
          return {
            error: "No se ha podido completar el registro, prueba de nuevo.",
          };
        }
      },

      login: async ({ email, password }) => {
        try {
          const res = await appFetch("/api/login", {
            method: "POST",
            body: { email, password },
          });

          const body = await res.json();

          if (res.ok) return getActions().setAuthenticatedUser(body);

          // Return the payload so the form can set errors
          return body;
        } catch (error) {
          console.error(error);
          return {
            error: "No se ha podido iniciar sesión. Prueba de nuevo.",
          };
        }
      },

      logout: () => {
        removeToken();
        setStore({ user: null });
      },

      setAuthenticatedUser: ({ user, token }) => {
        setToken(token);
        setStore({ user });
      },

      getAuthenticatedUser: async () => {
        const token = getToken();

        if (!token) return;

        try {
          const res = await appFetch("/api/authenticated", null, true);

          if (!res.ok) return removeToken();

          const { user, token } = await res.json();

          getActions().setAuthenticatedUser({ user, token });
        } catch (error) {
          console.warn(error);
        }
      },

      editUser: async (new_value, old_value, field_name) => {
        await fetch(process.env.BACKEND_URL + "/api/editUser", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ new_value, old_value, field_name }),
        })
          .then((respond) => {
            if (!respond.ok) throw new Error("Usurio no actualizado");

            return respond.json();
          })
          .then((data) => {
            setStore({ user: data });
          })
          .catch((error) => alert(error));
      },

      changeAvatar: async(file) => {
          alert(file)
      },

      changePassword: async (email, oldPassword, newPassword) => {
        console.log("change password");

        const user_data = {
          email,
          oldPassword,
          newPassword,
        };

        await fetch(process.env.BACKEND_URL + "/api/changePassword", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(user_data),
        })
          .then((respond) => {
            if (!respond.ok) throw new Error("Contraseña o Email incorrecto");

            alert("Contraseña cambiada con éxito");
          })
          .catch((error) => alert(error));
      },

      cancelSubscription: async (subject_id) => {
        const store = getStore();

        const cancel_data = {
          user_email: store.user.email,
          subject: subject_id,
        };

        await fetch(process.env.BACKEND_URL + "/api/cancelSubscription", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(cancel_data),
        })
          .then((respond) => {
            if (!respond.ok) throw new Error("Cancelación fallida");

            return respond.json();
          })
          .then((data) => {
            setStore({ user: data });

            alert("Cancelación exitosa");
          })
          .catch((error) => alert(error));
      },
    },
  };
};

export default getState;
