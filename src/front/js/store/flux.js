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
    },
  };
};

export default getState;
