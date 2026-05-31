//? ------------------------------------------------------------
import "./Style.scss";
import { memo } from "react";
//? ------------------------------------------------------------

const STYLE = {
  boxbg: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "10rem",
    height: "8rem",
    backgroundColor: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e0e0e0",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1",
  },

  box: {
    width: "100%",
    height: "65%",
  },

  text: {
    fontWeight: "bold",
    margin: "auto 0",
    cursor: "pointer",
  },

  textcl: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e0e0e0",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1",
    width: "10rem",
    height: "2rem",
  },
};

const copyText = text => {
  navigator.clipboard.writeText(text);
};

const Bg = memo(({ color, text }) => (
  <div style={STYLE.boxbg}>
    <span
      style={{
        ...STYLE.box,
        backgroundColor: color,
      }}
    ></span>

    <p style={STYLE.text} onClick={() => copyText(text)}>
      {text}
    </p>
  </div>
));

function Style() {
  return (
    <main>
      <Bg color="red" text="hello" />
    </main>
  );
}

export default memo(Style);
