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
        localStorage.removeItem("token");
        setStore({ user: null });
      },

      setAuthenticatedUser: ({ user, token }) => {
        localStorage.setItem("token", token);
        setStore({ user });
      },

      getAuthenticatedUser: async () => {
        const token = localStorage.getItem("token");

        if (!token) return;

        try {
          const res = await fetch(
            process.env.BACKEND_URL + "/api/authenticated",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (!res.ok) return localStorage.removeItem("token");

          const { user, token } = await res.json();

          getActions().setAuthenticatedUser({ user, token });
        } catch (error) {
          console.error(error);
        }
      },
    },
  };
};

export default getState;
