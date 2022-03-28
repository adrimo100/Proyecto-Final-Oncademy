const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      user: null,

      courses: [
        {
          id: 0,
          name: "1º ESO",
          subjects: [
            {
              name: "Matemáticas",
              course: "1º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image:
                "https://images.unsplash.com/photo-1600493033157-eed3fbe95d96?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            },
            {
              name: "Lengua",
              course: "1º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
            {
              name: "Física",
              course: "1º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
            {
              name: "Historia",
              course: "1º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
          ],
        },
        {
          id: 1,
          name: "2º ESO",
          subjects: [
            {
              name: "Matemáticas",
              course: "2º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
            {
              name: "Biología",
              course: "2º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
            {
              name: "Física",
              course: "2º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
            {
              name: "Historia",
              course: "2º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
          ],
        },
        {
          id: 2,
          name: "3º ESO",
          subjects: [
            {
              name: "Historia",
              course: "3º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
            {
              name: "Lengua",
              course: "3º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
            {
              name: "Química y Física",
              course: "3º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
            {
              name: "Ciencias Sociales",
              course: "3º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
          ],
        },
        {
          id: 3,
          name: "4º ESO",
          subjects: [
            {
              name: "Matemáticas",
              course: "4º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
            {
              name: "Lengua",
              course: "4º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
            {
              name: "Física",
              course: "4º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
            {
              name: "Química",
              course: "4º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
            {
              name: "Historia",
              course: "4º ESO",
              cardDescription:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque laoreet non dui et aliquet. In enim nulla, pharetra tincidunt mauris.",
              image: null,
            },
          ],
        },
      ],
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      getMessage: () => {
        // fetching data from the backend
        fetch(process.env.BACKEND_URL + "/api/hello")
          .then((resp) => resp.json())
          .then((data) => setStore({ message: data.message }))
          .catch((error) =>
            console.log("Error loading message from backend", error)
          );
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },
    },
  };
};

export default getState;
