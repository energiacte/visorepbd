// Import React and JS
import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'img/favicon.ico';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'styles/style.scss'; // CSS
import store from 'store/store.js';
import MainPage from 'components/MainPage.jsx';
import WeightingFactorsPage from 'components/WeightingFactorsPage.jsx';
import HelpPage from 'components/HelpPage.jsx';
import AboutPage from 'components/AboutPage.jsx';

// Render
ReactDOM.render(
  <Provider store={store} >
    <HashRouter>
      <Switch>
        <Route exact path="/weightingfactors" component={ WeightingFactorsPage }/>
        <Route exact path="/help" component={ HelpPage }/>
        <Route exact path="/about" component={ AboutPage }/>
        <Route exact path="/" component={ MainPage }/>
      </Switch>
    </HashRouter>
  </Provider>,
  document.body.appendChild(document.createElement('div'))
);
