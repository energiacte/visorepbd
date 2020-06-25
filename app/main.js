// Recursos generales
import "img/favicon.ico";
// Polyfills
import "@babel/polyfill/noConflict";
// Bootstrap
import "jquery";
import "popper.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "styles/font-awesome.min.css"; // copia de iconos fontawesome

// Import React and JS
import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

// Elementos propios
import "styles/style.scss"; // CSS
import store from "store/store.js";

import AboutPage from "components/AboutPage.jsx";
import HelpPage from "components/HelpPage.jsx";
import LoadDataPage from "components/LoadDataPage.jsx";
import MainPage from "components/MainPage.jsx";
import WeightingFactorsPage from "components/WeightingFactorsPage.jsx";

import { set_panic_hook } from "wasm-cteepbd";

set_panic_hook();

// Render
// Ver problemas con manejo de URLs en la app en https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually
// https://stackoverflow.com/questions/36857147/react-router-2-0-browserhistory-doesnt-work-when-refreshing/37622953#37622953
// Para usar BrowserRouter en vez de HashRouter, ver https://github.com/reactjs/react-router-tutorial/tree/master/lessons/10-clean-urls
ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route
          exact
          path="/weightingfactors"
          component={WeightingFactorsPage}
        />
        <Route exact path="/help" component={HelpPage} />
        <Route exact path="/about" component={AboutPage} />
        <Route exact path="/load/:epbddata" component={LoadDataPage} />
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById('visorepbdapp')
);
