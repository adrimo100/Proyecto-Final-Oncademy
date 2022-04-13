import { getToken, removeToken, setToken } from "../utils";

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

      checkoutSubjectStripe: (subject) => {
        var stripe = Stripe(
          "pk_test_51KjoxdLkR53a2kgb9ksFzfaSbUQZqFRWbLgBEfthEjPdiuSTvJks30xNmjb1cIdw1Ie43Wf6Y4sjsYtRCZU4v9bl00G9hMyzMs"
        );

        stripe
          .redirectToCheckout({
            lineItems: [{ price: subject.stripe_id, quantity: 1 }],
            mode: "subscription",
            /*
             * Do not rely on the redirect to the successUrl for fulfilling
             * purchases, customers may not always reach the success_url after
             * a successful payment.
             * Instead use one of the strategies described in
             * https://stripe.com/docs/payments/checkout/fulfill-orders
             */
            successUrl: window.location.href + `/success`,
            cancelUrl: window.location.href,
          })
          .then(function (result) {
            if (result.error) {
              /*
               * If `redirectToCheckout` fails due to a browser or network
               * error, display the localized error message to your customer.
               */
              var displayError = document.getElementById("error-message");
              displayError.textContent = result.error.message;
            }
          });
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
          })
          .catch((error) => console.log(error));
      },
      addUser: async (user) => {
        try {
          const res = await fetch(process.env.BACKEND_URL + "/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
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
          const res = await fetch(process.env.BACKEND_URL + "/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
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
          const res = await fetch(
            process.env.BACKEND_URL + "/api/authenticated",
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );

          if (!res.ok)
            throw new Error(
              `Impossible to return an user for the session JWT.`
            );

          const { user, token } = await res.json();

          getActions().setAuthenticatedUser({ user, token });
        } catch (error) {
          console.warn(error);
          removeToken();
        }
      },

      editUser: async (new_value, old_value, field_name) => {
        await fetch(process.env.BACKEND_URL + "/api/editUser", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
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
          },
          body: JSON.stringify(user_data),
        })
          .then((respond) => {
            if (!respond.ok) throw new Error("Contraseña o Email incorrecto");

            alert("Contraseña cambiada con éxito");
          })
          .catch((error) => alert(error));
      },
    },
  };
};

export default getState;
