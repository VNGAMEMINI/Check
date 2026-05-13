// npm run build,npm run deploy

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "../src/setting/setting.scss";

import data from "./json/pl10.json";
import Poser from "./element/poser.jsx";

const len = data.length;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <Poser data={data} title_h1={"Pháp luật"} title_p={`có ${len} câu hỏi`} />
    </>
  </StrictMode>,
);
/*
[
  
]npm run deploy
*/
