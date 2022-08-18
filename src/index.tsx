/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";

import App from "./App";

export const Fetch = (path: string): Promise<Response> => {
  if (import.meta.env.DEV) {
    return fetch(`http://localhost:62500${path}`);
  } else {
    return fetch(path);
  }
};

render(() => <App />, document.getElementById("root") as HTMLElement);
