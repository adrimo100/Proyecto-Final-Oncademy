//import react into the bundle
import React from "react";
import { createRoot } from "react-dom/client";

//include your index.scss file into the bundle
import "../styles/index.css";

// import bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";

// import toastify css
import "react-toastify/dist/ReactToastify.css";

//import your own components
import Layout from "./layout";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<Layout />);
