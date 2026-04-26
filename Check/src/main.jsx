//?
import { render } from "preact";
import { memo } from "preact/compat";
import { useState } from "preact/hooks";

import Poser from "./element/poser.jsx";
import data from "./json/test.json";
import "./setting/setting.scss";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Poser
        data={data}
        title_h1={"ngôn ngữ lập trình web"}
        title_p={"có 3 câu hỏi"}
      />
    </>
  );
}

render(<App />, document.getElementById("app"));
