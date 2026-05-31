//? ------------------------------------------------------------
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../src/setting/Style.scss";
import Style from "../src/setting/Style.jsx";

import data from "./json/test.json";
import Poser from "./element/Poser.jsx";
//? ------------------------------------------------------------

const testStyle = false;

createRoot(document.getElementById("root")).render(
  <StrictMode>{testStyle ? <Style /> : <Poser data={data} />}</StrictMode>,
);

//TODO: npm run build  |  npm run deploy
//TODO: https://vngamemini.github.io/Check/
