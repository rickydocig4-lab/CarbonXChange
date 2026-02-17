import { createElement } from "react";
import { createRoot } from "react-dom/client";
import htm from "htm";
import App from "./App.js";

const html = htm.bind(createElement);
const root = createRoot(document.getElementById("root"));
root.render(html`<${App} />`);