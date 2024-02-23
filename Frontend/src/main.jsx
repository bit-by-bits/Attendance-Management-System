import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App";
import Error from "./Error";
import Admin from "./components/admin";
import Student from "./components/student";
import Teacher from "./components/teacher";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
  },
  {
    path: "/admin",
    element: <Admin />,
    errorElement: <Error />,
  },
  {
    path: "/student",
    element: <Student />,
    errorElement: <Error />,
  },
  {
    path: "/teacher",
    element: <Teacher />,
    errorElement: <Error />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
