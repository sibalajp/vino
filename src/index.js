import React,  { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "antd/dist/antd.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

const Loader = () => <div>loading...</div>;

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Suspense fallback={<Loader />}>
      <App i18n={i18n}/>
    </Suspense>
  </I18nextProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();