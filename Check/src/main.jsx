import { HashRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";

import data from "./json/test.json";
import Poser from "./element/poser.jsx";

const len = data.length;

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <>
      <Poser data={data} title_h1={"trang web"} title_p={`có ${len} câu hỏi`} />
    </>
  </HashRouter>,
);
