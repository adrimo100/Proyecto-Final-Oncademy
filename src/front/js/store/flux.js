const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      courses: [],
      requestedCourse: { name: null, id: 0, subjects: [] },
      user: {
        role: "Student", //!!!BORRAR ANTES DE SUBIR A GITHUB!!!!
        subjects: [],
      },
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
            successUrl: window.location.href + `/Success`,
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
    },
  };
};

export default getState;
