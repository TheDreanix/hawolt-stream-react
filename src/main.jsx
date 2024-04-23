import React from "react";
import ReactDOM from "react-dom/client";

import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/main.scss";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SingleStream from "./components/Pages/SingleStream/SingleStream";
import Home from "./components/Pages/Home";

const router = createBrowserRouter([
  {
    element: <Home />,
    path: "",
  },
  {
    element: <SingleStream />,
    path: "stream/:userAccount",
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
