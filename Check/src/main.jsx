//? ------------------------------------------------------------
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../src/style/Style.scss";

import data from "./json/Anh.json";
import Poser from "./element/Poser.jsx";
//? ------------------------------------------------------------

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Poser data={data} />
  </StrictMode>,
);

//TODO: npm run build  |  npm run deploy
//TODO: https://vngamemini.github.io/Check/
